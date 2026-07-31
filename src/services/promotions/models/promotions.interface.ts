import type { IBaseItem } from '@/models/base-items.interface';
import type { IProductPagination } from '@/services/products/models/products.interface';

export type PromotionScope =
	| 'ALL'
	| 'CATEGORY'
	| 'SUBCATEGORY'
	| 'PRODUCTS'
	| 'COMBOS';

export type PromotionValueType = 'PERCENTAGE' | 'FIXED';

export interface IPromotionData extends IBaseItem {
	description?: string;
	scope: PromotionScope;
	/** Populated by the API so the listing can name what a promotion reaches. */
	categories: IBaseItem[];
	subCategories: IBaseItem[];
	products: IBaseItem[];
	combos: IBaseItem[];
	valueType: PromotionValueType;
	value: number;
	/** Null means automatic: it applies on its own, with nothing to type in. */
	code: string | null;
	startsAt: string | null;
	endsAt: string | null;
	minPurchase?: number;
	usageLimit?: number;
	usageLimitPerUser?: number;
	usedCount: number;
	isActive: boolean;
}

export interface IPromotion {
	data: IPromotionData[];
	pagination: IProductPagination;
}

export interface IPromotionFilters {
	page?: number;
	limit?: number;
	search?: string;
	isActive?: boolean;
}

/** Body of a create/update request: the reference lists travel as ids. */
export interface IPromotionPayload {
	name: string;
	description?: string;
	scope: PromotionScope;
	categories?: string[];
	subCategories?: string[];
	products?: string[];
	combos?: string[];
	valueType: PromotionValueType;
	value: number;
	code?: string;
	startsAt?: string;
	endsAt?: string;
	minPurchase?: number;
	usageLimit?: number;
	usageLimitPerUser?: number;
	isActive?: boolean;
}
