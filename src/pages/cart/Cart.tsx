import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
	cartLineImage,
	cartLineName,
	useCartStore,
} from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { useModalStore } from '@/stores/modal.store';
import CartCheckout from './components/CartCheckout';
import type { ICartProps } from './models/cart-props.interface';

type CartView = 'cart' | 'checkout';

const Cart: React.FC<ICartProps> = ({ onClose }) => {
	const [isClosing, setIsClosing] = useState(false);
	const [view, setView] = useState<CartView>('cart');
	const modalRef = useRef<HTMLDivElement>(null);

	const items = useCartStore((state) => state.items);
	const incrementQuantity = useCartStore((state) => state.incrementQuantity);
	const decrementQuantity = useCartStore((state) => state.decrementQuantity);
	const removeItem = useCartStore((state) => state.removeItem);
	const getTotalPrice = useCartStore((state) => state.getTotalPrice);
	const fetchCart = useCartStore((state) => state.fetchCart);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const openModal = useModalStore((state) => state.open);

	useEffect(() => {
		if (isAuthenticated) fetchCart();
	}, [isAuthenticated, fetchCart]);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => onClose(), 200);
	};

	useClickOutside(modalRef, handleClose);

	const handleCheckoutClick = () => {
		if (!isAuthenticated) {
			openModal('login');
			return;
		}
		setView('checkout');
	};

	const handleCheckoutSuccess = () => {
		setView('cart');
		handleClose();
	};

	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end ${
				isClosing ? 'animate-fade-out' : 'animate-fade-in'
			}`}>
			<div
				ref={modalRef}
				className={`w-full max-w-md bg-white h-full flex flex-col shadow-xl overflow-hidden ${
					isClosing
						? 'animate-slide-out-to-right'
						: 'animate-slide-in-from-right'
				}`}>
				<header className='flex items-center justify-between px-4 py-4 border-b-2 border-aromas_gray_line'>
					{view === 'checkout' ? (
						<button
							onClick={() => setView('cart')}
							className='flex items-center gap-x-1 text-aromas_fucsia'>
							<ArrowLeft className='h-4 w-4' />
							<span>volver</span>
						</button>
					) : (
						<h2 className='text-xl font-bold text-aromas_gray_text'>
							Carrito de Compras
						</h2>
					)}
					<button
						onClick={handleClose}
						className='p-1 rounded-full hover:bg-gray-200'>
						<X className='h-6 w-6 text-aromas_gray_text' />
					</button>
				</header>

				{view === 'checkout' ? (
					<CartCheckout onSuccess={handleCheckoutSuccess} />
				) : (
					<>
						<main className='flex-1 overflow-y-auto p-4'>
							{items.length === 0 ? (
								<div className='flex flex-col items-center justify-center gap-y-3 h-full text-center'>
									<ShoppingBag className='h-10 w-10 text-aromas_gray_line' />
									<p className='text-aromas_gray_text'>
										Tu carrito está vacío.
									</p>
								</div>
							) : (
								<ul className='flex flex-col gap-y-6'>
									{items.map((item) => {
										const name = cartLineName(item);
										const image = cartLineImage(item);

										return (
											<li key={item.key} className='flex gap-x-4'>
												{image ? (
													<img
														src={image}
														alt={name}
														className='w-16 h-16 rounded-lg object-cover bg-aromas_home_bg'
													/>
												) : (
													// A combo may be published before
													// its photo exists.
													<div className='flex h-16 w-16 items-center justify-center rounded-lg bg-aromas_pink/20'>
														<ShoppingBag className='h-6 w-6 text-aromas_fucsia' />
													</div>
												)}
												<div className='flex-1 flex flex-col gap-y-1'>
													<div className='flex items-start justify-between gap-x-2'>
														<p className='font-bold text-aromas_gray_text'>
															{name}
															{item.itemType ===
																'COMBO' && (
																<span className='ml-2 rounded bg-aromas_fucsia px-1.5 py-0.5 text-xs font-bold text-white'>
																	COMBO
																</span>
															)}
														</p>
														<button
															aria-label={`Quitar ${name}`}
															onClick={() =>
																removeItem(item.key)
															}
															className='text-aromas_fucsia hover:text-red-600 transition-colors'>
															<Trash2 className='h-5 w-5' />
														</button>
													</div>
													<p className='text-aromas_fucsia font-semibold'>
														${item.unitPrice.toFixed(2)}
													</p>
													<div className='flex items-center gap-x-3'>
														<button
															aria-label={`Quitar una unidad de ${name}`}
															onClick={() =>
																decrementQuantity(
																	item.key
																)
															}
															className='p-1 rounded-full text-aromas_fucsia hover:bg-aromas_pink/20'>
															<Minus className='h-4 w-4' />
														</button>
														<span className='text-aromas_gray_text'>
															{item.quantity}
														</span>
														<button
															aria-label={`Agregar una unidad de ${name}`}
															onClick={() =>
																incrementQuantity(
																	item.key
																)
															}
															className='p-1 rounded-full text-aromas_fucsia hover:bg-aromas_pink/20'>
															<Plus className='h-4 w-4' />
														</button>
													</div>
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</main>

						<footer className='border-t-2 border-aromas_gray_line p-4 flex flex-col gap-y-4'>
							<div className='flex flex-col gap-y-1'>
								<div className='flex items-center justify-between'>
									<h3 className='text-lg font-bold text-aromas_gray_text'>
										Total
									</h3>
									<p className='text-lg font-bold text-aromas_fucsia'>
										${getTotalPrice().toFixed(2)}
									</p>
								</div>
								{items.length > 0 && (
									// The gross sum, on purpose: only the server can
									// price promotions and coupons, and it does so on
									// the checkout step right after this.
									<p className='text-xs text-aromas_gray_text'>
										Los descuentos y cupones se calculan al
										finalizar la compra.
									</p>
								)}
							</div>
							<button
								onClick={handleCheckoutClick}
								disabled={items.length === 0}
								className='w-full bg-aromas_pink text-aromas_gray_text font-bold py-3 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:cursor-pointer border border-transparent hover:enabled:border-aromas_fucsia transition-colors'>
								Finalizar compra
							</button>
						</footer>
					</>
				)}
			</div>
		</div>
	);
};

export default Cart;
