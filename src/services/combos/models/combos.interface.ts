import type { IBaseItem } from '@/models/base-items.interface';
import type { IProductPagination } from '@/services/products/models/products.interface';

export type ComboPriceMode = 'FIXED' | 'PERCENTAGE';

/** A component as the API returns it, with the product populated. */
export interface IComboItemData {
	product: {
		_id: string;
		name: string;
		price: number;
		stock: number;
		isActive: boolean;
		images?: string[];
	};
	/** Units of this product per single combo. */
	quantity: number;
}

export interface IComboData extends IBaseItem {
	description?: string;
	images: string[];
	items: IComboItemData[];
	priceMode: ComboPriceMode;
	fixedPrice?: number;
	discountPercentage?: number;
	isActive: boolean;
	/**
	 * Derived by the API from the components on every read, never stored: a
	 * persisted copy would go stale as soon as a component price or stock moved.
	 */
	price: number;
	compareAtPrice: number;
	savings: number;
	stock: number;
}

export interface ICombo {
	data: IComboData[];
	pagination: IProductPagination;
}

export interface IComboFilters {
	page?: number;
	limit?: number;
	search?: string;
	isActive?: boolean;
	hasStock?: boolean;
}

/** Body of a create/update request: components travel as ids plus a quantity. */
export interface IComboPayload {
	name: string;
	description?: string;
	images?: string[];
	items: { productId: string; quantity: number }[];
	priceMode: ComboPriceMode;
	fixedPrice?: number;
	discountPercentage?: number;
	isActive?: boolean;
}
