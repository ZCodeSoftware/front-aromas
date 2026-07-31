import type { IComboData } from '@/services/combos/models/combos.interface';
import type { IProductData } from '@/services/products/models/products.interface';
import type { IPromotionData } from '@/services/promotions/models/promotions.interface';

/** What a card needs to render a price, struck-through original included. */
export interface IDisplayPricing {
	finalPrice: number;
	/** Only set when there is something to strike through. */
	compareAtPrice?: number;
	/** Short badge text, e.g. "-20%". */
	discountLabel?: string;
}

const round2 = (value: number): number =>
	Math.round((value + Number.EPSILON) * 100) / 100;

const idOf = (reference: { _id: string } | string): string =>
	typeof reference === 'string' ? reference : reference._id;

/**
 * Whether an automatic promotion reaches a loose product.
 *
 * DELIBERATE DUPLICATION of PromotionModel.matches() on the backend. This exists
 * only so the grid can show a struck-through price without a round trip per card;
 * the authoritative number is always the one `/order/preview` returns at checkout.
 * If the backend rule changes, this has to change with it.
 */
const reachesProduct = (
	promotion: IPromotionData,
	product: IProductData
): boolean => {
	switch (promotion.scope) {
		case 'ALL':
			return true;
		case 'CATEGORY':
			return promotion.categories.some(
				(category) => idOf(category) === idOf(product.category ?? '')
			);
		case 'SUBCATEGORY':
			return promotion.subCategories.some(
				(subCategory) => idOf(subCategory) === idOf(product.subCategory ?? '')
			);
		case 'PRODUCTS':
			return promotion.products.some((item) => idOf(item) === product._id);
		// A combo-scoped promotion never reaches a loose product.
		case 'COMBOS':
		default:
			return false;
	}
};

/**
 * Whether an automatic promotion reaches a combo. Only ALL and COMBOS do: the
 * components of a combo are already sold below list price, so a category or
 * product rule must not reach inside it. Mirrors COMBO_SCOPES on the backend.
 */
const reachesCombo = (promotion: IPromotionData, combo: IComboData): boolean => {
	if (promotion.scope === 'ALL') return true;
	if (promotion.scope !== 'COMBOS') return false;

	return promotion.combos.some((item) => idOf(item) === combo._id);
};

/**
 * A FIXED promotion is an order-level amount split across the cart, so a single
 * card cannot know its share. Showing the whole amount off one product would
 * overstate the discount, so the storefront only previews percentages and leaves
 * flat amounts to the checkout.
 */
const isPreviewable = (promotion: IPromotionData): boolean =>
	promotion.valueType === 'PERCENTAGE' && !promotion.minPurchase;

/**
 * The best automatic percentage reaching this item, as a display price. Returns
 * the list price untouched when nothing applies. Automatic promotions do not
 * stack, so the largest one wins — the same rule the pricing engine applies.
 */
const bestFor = (
	promotions: IPromotionData[],
	listPrice: number,
	reaches: (promotion: IPromotionData) => boolean
): IDisplayPricing => {
	const best = promotions
		.filter((promotion) => isPreviewable(promotion) && reaches(promotion))
		.reduce<IPromotionData | null>(
			(winner, promotion) =>
				!winner || promotion.value > winner.value ? promotion : winner,
			null
		);

	if (!best || listPrice <= 0) return { finalPrice: listPrice };

	const finalPrice = round2((listPrice * (100 - best.value)) / 100);

	return {
		finalPrice,
		compareAtPrice: listPrice,
		discountLabel: `-${best.value}%`,
	};
};

export const pricingForProduct = (
	promotions: IPromotionData[],
	product: IProductData
): IDisplayPricing =>
	bestFor(promotions, product.price, (promotion) =>
		reachesProduct(promotion, product)
	);

/**
 * A combo already carries its own struck-through price (the sum of its parts).
 * When a promotion also reaches it, the two stack visually: the comparison stays
 * against the sum, and the final price drops further.
 */
export const pricingForCombo = (
	promotions: IPromotionData[],
	combo: IComboData
): IDisplayPricing => {
	const promotional = bestFor(promotions, combo.price, (promotion) =>
		reachesCombo(promotion, combo)
	);

	const finalPrice = promotional.finalPrice;
	const compareAtPrice =
		combo.compareAtPrice > finalPrice ? combo.compareAtPrice : undefined;
	const savedPercentage = compareAtPrice
		? Math.round(((compareAtPrice - finalPrice) / compareAtPrice) * 100)
		: 0;

	return {
		finalPrice,
		compareAtPrice,
		discountLabel: savedPercentage > 0 ? `-${savedPercentage}%` : undefined,
	};
};
