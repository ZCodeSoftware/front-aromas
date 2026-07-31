import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { useAuthStore } from './auth.store';
import { cartGetService } from '@/services/cart/GET/cart.service.get';
import { cartPostService } from '@/services/cart/POST/cart.service.post';
import { cartPatchService } from '@/services/cart/PATCH/cart.service.patch';
import { cartDeleteService } from '@/services/cart/DELETE/cart.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { IProductData } from '@/services/products/models/products.interface';
import type { IComboData } from '@/services/combos/models/combos.interface';
import type { ICart, CartItemType } from '@/services/cart/models/cart.interface';

export interface ICartItem {
	itemType: CartItemType;
	/**
	 * Identity of the line: the type plus the id it points at. The type is part of
	 * it because product and combo ids come from different collections and must
	 * never be matched against each other.
	 */
	key: string;
	product?: {
		_id: string;
		name: string;
		price: number;
		images: string[];
	};
	combo?: {
		_id: string;
		name: string;
		images: string[];
	};
	quantity: number;
	unitPrice: number;
}

interface CartStore {
	items: ICartItem[];
	isLoading: boolean;

	fetchCart: () => Promise<void>;
	addItem: (product: IProductData, quantity?: number) => Promise<void>;
	addCombo: (combo: IComboData, quantity?: number) => Promise<void>;
	removeItem: (key: string) => Promise<void>;
	incrementQuantity: (key: string) => Promise<void>;
	decrementQuantity: (key: string) => Promise<void>;
	clearCart: () => Promise<void>;
	resetLocalCart: () => void;
	mergeGuestCartIntoBackend: () => Promise<void>;

	getTotalItems: () => number;
	getTotalPrice: () => number;
}

export const cartLineKey = (itemType: CartItemType, id: string): string =>
	`${itemType}:${id}`;

/** Display name of a line, whichever kind it is. */
export const cartLineName = (item: ICartItem): string =>
	(item.itemType === 'COMBO' ? item.combo?.name : item.product?.name) ?? '';

/** First image of a line, whichever kind it is. */
export const cartLineImage = (item: ICartItem): string | undefined =>
	(item.itemType === 'COMBO' ? item.combo?.images : item.product?.images)?.[0];

const mapBackendCart = (cart: ICart): ICartItem[] =>
	cart.items
		.map((item): ICartItem | null => {
			// Lines written before combos existed carry no itemType at all, so a
			// missing value has to read as PRODUCT rather than as "unknown".
			const itemType = item.itemType ?? 'PRODUCT';

			if (itemType === 'COMBO') {
				if (!item.combo) return null;

				return {
					itemType,
					key: cartLineKey(itemType, item.combo._id),
					combo: {
						_id: item.combo._id,
						name: item.combo.name,
						images: item.combo.images ?? [],
					},
					quantity: item.quantity,
					unitPrice: item.unitPrice,
				};
			}

			if (!item.product) return null;

			return {
				itemType,
				key: cartLineKey(itemType, item.product._id),
				product: {
					_id: item.product._id,
					name: item.product.name,
					price: item.product.price,
					images: item.product.images ?? [],
				},
				quantity: item.quantity,
				unitPrice: item.unitPrice,
			};
		})
		.filter((item): item is ICartItem => item !== null);

const isAuthenticated = () => useAuthStore.getState().isAuthenticated;

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isLoading: false,

			fetchCart: async () => {
				if (!isAuthenticated()) return;
				set({ isLoading: true });
				try {
					const cart = await cartGetService.getMyCart();
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(error, 'No se pudo cargar tu carrito.')
					);
				} finally {
					set({ isLoading: false });
				}
			},

			addItem: async (product, quantity = 1) => {
				const key = cartLineKey('PRODUCT', product._id);

				if (!isAuthenticated()) {
					set((state) => ({
						items: accumulate(state.items, key, quantity, () => ({
							itemType: 'PRODUCT',
							key,
							product: {
								_id: product._id,
								name: product.name,
								price: product.price,
								images: product.images,
							},
							quantity,
							unitPrice: product.price,
						})),
					}));
					return;
				}

				try {
					const cart = await cartPostService.addItem({
						productId: product._id,
						quantity,
					});
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(
							error,
							'No se pudo agregar el producto al carrito.'
						)
					);
					throw error;
				}
			},

			addCombo: async (combo, quantity = 1) => {
				const key = cartLineKey('COMBO', combo._id);

				if (!isAuthenticated()) {
					set((state) => ({
						items: accumulate(state.items, key, quantity, () => ({
							itemType: 'COMBO',
							key,
							combo: {
								_id: combo._id,
								name: combo.name,
								images: combo.images,
							},
							quantity,
							unitPrice: combo.price,
						})),
					}));
					return;
				}

				try {
					const cart = await cartPostService.addItem({
						comboId: combo._id,
						quantity,
					});
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(
							error,
							'No se pudo agregar el combo al carrito.'
						)
					);
					throw error;
				}
			},

			removeItem: async (key) => {
				const item = get().items.find((current) => current.key === key);
				if (!item) return;

				if (!isAuthenticated()) {
					set((state) => ({
						items: state.items.filter((current) => current.key !== key),
					}));
					return;
				}
				try {
					const cart =
						item.itemType === 'COMBO'
							? await cartDeleteService.removeCombo(item.combo!._id)
							: await cartDeleteService.removeItem(item.product!._id);
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(
							error,
							'No se pudo eliminar el producto del carrito.'
						)
					);
				}
			},

			incrementQuantity: async (key) => {
				await changeQuantity(get, set, key, (quantity) => quantity + 1);
			},

			decrementQuantity: async (key) => {
				await changeQuantity(get, set, key, (quantity) => quantity - 1);
			},

			clearCart: async () => {
				if (!isAuthenticated()) {
					set({ items: [] });
					return;
				}
				try {
					const cart = await cartDeleteService.clearCart();
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(error, 'No se pudo vaciar el carrito.')
					);
				}
			},

			resetLocalCart: () => set({ items: [] }),

			mergeGuestCartIntoBackend: async () => {
				const guestItems = get().items;
				for (const item of guestItems) {
					try {
						await cartPostService.addItem(
							item.itemType === 'COMBO'
								? { comboId: item.combo!._id, quantity: item.quantity }
								: {
										productId: item.product!._id,
										quantity: item.quantity,
									}
						);
					} catch (error) {
						console.error(
							`No se pudo migrar "${cartLineName(item)}" al carrito.`,
							error
						);
					}
				}
				await get().fetchCart();
			},

			getTotalItems: () =>
				get().items.reduce((total, item) => total + item.quantity, 0),

			/**
			 * Gross sum of the lines. Discounts are deliberately absent: only the
			 * backend can price them, and a guest has no cart there to price. The
			 * authoritative figure comes from `/order/preview` at checkout.
			 */
			getTotalPrice: () =>
				get().items.reduce(
					(total, item) => total + item.unitPrice * item.quantity,
					0
				),
		}),
		{
			name: 'cart-storage',
			partialize: (state) => ({ items: state.items }),
			// Bumped when combos introduced `itemType` and `key`. Without the
			// migration below, every shopper with a saved cart would crash on the
			// first read of `item.key`.
			version: 1,
			migrate: (persisted, version) => {
				const state = persisted as { items?: ICartItem[] };

				if (version === 0 && state?.items) {
					return {
						items: state.items
							.filter((item) => item.product?._id)
							.map((item) => ({
								...item,
								itemType: 'PRODUCT' as CartItemType,
								key: cartLineKey('PRODUCT', item.product!._id),
							})),
					};
				}

				return state;
			},
		}
	)
);

/** Adds `quantity` onto the matching line, or appends the one `build` returns. */
const accumulate = (
	items: ICartItem[],
	key: string,
	quantity: number,
	build: () => ICartItem
): ICartItem[] => {
	const existing = items.find((item) => item.key === key);

	if (!existing) return [...items, build()];

	return items.map((item) =>
		item.key === key ? { ...item, quantity: item.quantity + quantity } : item
	);
};

/**
 * Shared body of increment and decrement. A guest is updated locally; a signed-in
 * shopper goes through the route matching the line's kind, and the backend answer
 * replaces the list so stock rejections are reflected rather than assumed.
 */
const changeQuantity = async (
	get: () => CartStore,
	set: (partial: Partial<CartStore>) => void,
	key: string,
	next: (quantity: number) => number
): Promise<void> => {
	const item = get().items.find((current) => current.key === key);
	if (!item) return;

	const nextQuantity = next(item.quantity);

	if (!isAuthenticated()) {
		set({
			items: get()
				.items.map((current) =>
					current.key === key
						? { ...current, quantity: nextQuantity }
						: current
				)
				.filter((current) => current.quantity > 0),
		});
		return;
	}

	try {
		const cart =
			item.itemType === 'COMBO'
				? await cartPatchService.updateComboQuantity(
						item.combo!._id,
						nextQuantity
					)
				: await cartPatchService.updateItemQuantity(
						item.product!._id,
						nextQuantity
					);
		set({ items: mapBackendCart(cart) });
	} catch (error) {
		toast.error(getApiErrorMessage(error, 'No se pudo actualizar la cantidad.'));
	}
};
