export interface IFilterOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
	isActive?: boolean;
	search?: string;
	priceMin?: number;
	priceMax?: number;
	hasStock?: boolean;
	brandId?: string[];
	colorId?: string[];
	essenceId?: string[];
	categoryId?: string[];
	subCategoryId?: string[];
	stockMin?: number;
	stockMax?: number;
}
