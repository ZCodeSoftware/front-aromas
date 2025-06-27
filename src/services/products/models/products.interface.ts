import type { IAssociatedEmotion } from '@/services/catalogs/associated-emotions/models/associated-emotion.interface';
import type { IBrand } from '@/services/catalogs/brand/models/brands.interface';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';

export interface IProductData {
	_id: number;
	name: string;
	price: number;
	description: string;
	images: string;
	color: IColor;
	category: ICategory;
	subCategory: ISubCategory;
	essences: IEssence;
	beneficio_energetico: string;
	associatedEmotion: IAssociatedEmotion;
	brand: IBrand;
	isActive: boolean;
	stock: number;
}

export interface IProductPagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}
export interface IProduct {
	data: IProductData[];
	pagination: IProductPagination;
}
