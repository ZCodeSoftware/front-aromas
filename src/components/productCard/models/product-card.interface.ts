import type { IDisplayPricing } from '@/lib/pricing';
import type { IProductData } from '@/services/products/models/products.interface';

export interface IProductCardProps {
	product: IProductData;
	/**
	 * What to show as the price. Omitted means "just the list price": an estimate
	 * for the grid, never the figure the buyer is charged — that one comes from
	 * the checkout preview.
	 */
	pricing?: IDisplayPricing;
}
