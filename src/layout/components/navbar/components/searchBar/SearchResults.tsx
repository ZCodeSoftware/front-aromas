import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cart.store';
import type { ISearchResultItemProps } from './models/search-result-props.interface';

export const SearchResults = ({ product }: ISearchResultItemProps) => {
	const addItem = useCartStore((state) => state.addItem);
	const isSoldOut = product.stock <= 0;

	/**
	 * Adding to the cart, rather than the `href='#'` this used to be: there is no
	 * product detail page to link to, and a link that goes nowhere is worse than
	 * no link at all.
	 */
	const handleAddToCart = async () => {
		try {
			await addItem(product);
			toast.success(`${product.name} agregado al carrito.`);
		} catch {
			// error already surfaced via toast inside the cart store
		}
	};

	return (
		<button
			type='button'
			onClick={handleAddToCart}
			disabled={isSoldOut}
			aria-label={`Agregar ${product.name} al carrito`}
			className='flex w-full items-center space-x-4 p-2 text-left hover:bg-aromas_nav_bg rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>
			{product.images?.[0] ? (
				<img
					src={product.images[0]}
					alt={product.name}
					className='w-16 h-16 rounded-lg object-cover bg-white'
				/>
			) : (
				<div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-aromas_pink/20'>
					<ShoppingBag className='h-6 w-6 text-aromas_fucsia' />
				</div>
			)}
			<div className='min-w-0 flex-1'>
				<p className='truncate text-aromas_gray_text font-semibold'>
					{product.name}
				</p>
				<p className='text-aromas_fucsia font-medium'>
					${product.price.toFixed(2)}
				</p>
			</div>
			{!isSoldOut && (
				<ShoppingBag className='h-5 w-5 shrink-0 text-aromas_fucsia' />
			)}
			{isSoldOut && (
				<span className='shrink-0 text-xs text-aromas_gray_text'>
					Sin stock
				</span>
			)}
		</button>
	);
};
