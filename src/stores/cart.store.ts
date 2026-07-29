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
import type { ICart } from '@/services/cart/models/cart.interface';

export interface ICartItem {
	product: {
		_id: string;
		name: string;
		price: number;
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
	removeItem: (productId: string) => Promise<void>;
	incrementQuantity: (productId: string) => Promise<void>;
	decrementQuantity: (productId: string) => Promise<void>;
	clearCart: () => Promise<void>;
	resetLocalCart: () => void;
	mergeGuestCartIntoBackend: () => Promise<void>;

	getTotalItems: () => number;
	getTotalPrice: () => number;
}

const mapBackendCart = (cart: ICart): ICartItem[] =>
	cart.items
		.filter((item): item is typeof item & { product: NonNullable<typeof item.product> } =>
			Boolean(item.product)
		)
		.map((item) => ({
			product: {
				_id: item.product._id,
				name: item.product.name,
				price: item.product.price,
				images: item.product.images,
			},
			quantity: item.quantity,
			unitPrice: item.unitPrice,
		}));

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
				if (!isAuthenticated()) {
					set((state) => {
						const existing = state.items.find(
							(item) => item.product._id === product._id
						);
						if (existing) {
							return {
								items: state.items.map((item) =>
									item.product._id === product._id
										? {
												...item,
												quantity: item.quantity + quantity,
											}
										: item
								),
							};
						}
						return {
							items: [
								...state.items,
								{
									product: {
										_id: product._id,
										name: product.name,
										price: product.price,
										images: product.images,
									},
									quantity,
									unitPrice: product.price,
								},
							],
						};
					});
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

			removeItem: async (productId) => {
				if (!isAuthenticated()) {
					set((state) => ({
						items: state.items.filter(
							(item) => item.product._id !== productId
						),
					}));
					return;
				}
				try {
					const cart = await cartDeleteService.removeItem(productId);
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

			incrementQuantity: async (productId) => {
				const item = get().items.find(
					(item) => item.product._id === productId
				);
				if (!item) return;

				if (!isAuthenticated()) {
					set((state) => ({
						items: state.items.map((item) =>
							item.product._id === productId
								? { ...item, quantity: item.quantity + 1 }
								: item
						),
					}));
					return;
				}

				try {
					const cart = await cartPatchService.updateItemQuantity(
						productId,
						item.quantity + 1
					);
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(error, 'No se pudo actualizar la cantidad.')
					);
				}
			},

			decrementQuantity: async (productId) => {
				const item = get().items.find(
					(item) => item.product._id === productId
				);
				if (!item) return;
				const nextQuantity = item.quantity - 1;

				if (!isAuthenticated()) {
					set((state) => ({
						items: state.items
							.map((item) =>
								item.product._id === productId
									? { ...item, quantity: nextQuantity }
									: item
							)
							.filter((item) => item.quantity > 0),
					}));
					return;
				}

				try {
					const cart = await cartPatchService.updateItemQuantity(
						productId,
						nextQuantity
					);
					set({ items: mapBackendCart(cart) });
				} catch (error) {
					toast.error(
						getApiErrorMessage(error, 'No se pudo actualizar la cantidad.')
					);
				}
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
						await cartPostService.addItem({
							productId: item.product._id,
							quantity: item.quantity,
						});
					} catch (error) {
						console.error(
							`No se pudo migrar "${item.product.name}" al carrito.`,
							error
						);
					}
				}
				await get().fetchCart();
			},

			getTotalItems: () =>
				get().items.reduce((total, item) => total + item.quantity, 0),

			getTotalPrice: () =>
				get().items.reduce(
					(total, item) => total + item.unitPrice * item.quantity,
					0
				),
		}),
		{ name: 'cart-storage', partialize: (state) => ({ items: state.items }) }
	)
);
