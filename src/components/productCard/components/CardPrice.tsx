import type { IDisplayPricing } from '@/lib/pricing';

interface ICardPriceProps {
	pricing: IDisplayPricing;
}

/**
 * The price block of a card: the original struck through when there is a discount,
 * the final price, and a badge with how much comes off. Shared by ProductCard and
 * ComboCard so a promotion and a combo read the same way in the grid.
 */
const CardPrice: React.FC<ICardPriceProps> = ({ pricing }) => {
	const hasDiscount =
		pricing.compareAtPrice !== undefined &&
		pricing.compareAtPrice > pricing.finalPrice;

	if (!hasDiscount) {
		return (
			<p className='text-lg font-bold text-aromas_fucsia whitespace-nowrap pl-4'>
				${pricing.finalPrice.toFixed(2)}
			</p>
		);
	}

	return (
		<div className='flex flex-col items-end whitespace-nowrap pl-4'>
			<div className='flex items-center gap-2'>
				<s className='text-sm text-aromas_gray_text/60'>
					${pricing.compareAtPrice!.toFixed(2)}
				</s>
				{pricing.discountLabel && (
					<span className='rounded bg-aromas_fucsia px-1.5 py-0.5 text-xs font-bold text-white'>
						{pricing.discountLabel}
					</span>
				)}
			</div>
			<p className='text-lg font-bold text-aromas_fucsia'>
				${pricing.finalPrice.toFixed(2)}
			</p>
		</div>
	);
};

export default CardPrice;
