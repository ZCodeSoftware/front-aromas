import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from '@/components/ui/card';
import CardPrice from '@/components/productCard/components/CardPrice';
import { useCartStore } from '@/stores/cart.store';
import type { IDisplayPricing } from '@/lib/pricing';
import type { IComboData } from '@/services/combos/models/combos.interface';

interface IComboCardProps {
	combo: IComboData;
	pricing?: IDisplayPricing;
}

/**
 * Same layout as ProductCard so the grid reads as one thing, plus a COMBO badge
 * and the list of what is inside — which is the only reason a shopper can judge
 * whether the price is a good one.
 */
const ComboCard: React.FC<IComboCardProps> = ({ combo, pricing }) => {
	const addCombo = useCartStore((state) => state.addCombo);
	const isSoldOut = combo.stock <= 0;

	const handleAddToCart = async () => {
		try {
			await addCombo(combo);
			toast.success(`${combo.name} agregado al carrito.`);
		} catch {
			// error already surfaced via toast inside the cart store
		}
	};

	const contents = combo.items
		.map((item) => `${item.quantity} x ${item.product?.name ?? ''}`)
		.join(' · ');

	return (
		<Card className='w-full max-w-[389px] min-h-[420px] rounded-2xl overflow-hidden shadow-none bg-aromas_home_bg border-none flex flex-col gap-4 py-0'>
			<div className='relative'>
				<div className='w-full aspect-[16/9] h-64'>
					{combo.images?.[0] ? (
						<img
							src={combo.images[0]}
							alt={combo.name}
							className='object-cover w-full h-full rounded-lg'
						/>
					) : (
						// Combos are often published before their photo exists; a
						// broken image icon would look like a bug in the shop.
						<div className='flex h-full w-full items-center justify-center rounded-lg bg-aromas_pink/20'>
							<ShoppingBag
								className='h-12 w-12 text-aromas_fucsia'
								strokeWidth={1.5}
							/>
						</div>
					)}
				</div>
				<span className='absolute top-3 left-3 rounded-full bg-aromas_fucsia px-3 py-1 text-xs font-bold text-white'>
					COMBO
				</span>
			</div>
			<CardContent className='px-2 flex-1 flex flex-col'>
				<div className='flex justify-between items-start mb-2'>
					<CardTitle className='text-lg font-bold text-aromas_gray_text'>
						{combo.name}
					</CardTitle>
					<CardPrice pricing={pricing ?? { finalPrice: combo.price }} />
				</div>
				<CardDescription className='text-aromas_gray_text text-sm line-clamp-2'>
					{combo.description || contents}
				</CardDescription>
				<p className='mt-2 text-xs text-aromas_gray_text/80 line-clamp-2'>
					{contents}
				</p>
			</CardContent>
			<CardFooter className='py-2 px-0 pt-0 mt-auto'>
				<button
					onClick={handleAddToCart}
					disabled={isSoldOut}
					className='w-full bg-aromas_pink text-aromas_gray_text font-bold py-2 px-4 rounded-3xl flex items-center justify-center gap-2 border border-transparent hover:border-aromas_fucsia transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'>
					<ShoppingBag className='h-5 w-5' />
					<span>{isSoldOut ? 'Sin stock' : 'Añadir al carrito'}</span>
				</button>
			</CardFooter>
		</Card>
	);
};

export default ComboCard;
