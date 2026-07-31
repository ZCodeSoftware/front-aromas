import type { IComboData } from '@/services/combos/models/combos.interface';
import type { IProductData } from '@/services/products/models/products.interface';

/**
 * A card of the storefront grid. Products and combos live in the same grid but
 * come from different collections, so the kind has to travel with the data.
 */
export type IStoreCard =
	| { kind: 'product'; data: IProductData }
	| { kind: 'combo'; data: IComboData };

/** What the shopper chose to see. */
export type StoreCardFilter = 'all' | 'products' | 'combos';
