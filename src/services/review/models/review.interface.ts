export interface IReviewAuthor {
	_id: string;
	firstName?: string;
	lastName?: string;
}

export interface IReviewProduct {
	_id: string;
	name: string;
	images: string[];
}

export interface IReview {
	_id: string;
	user: string | IReviewAuthor;
	product: string | IReviewProduct;
	rating: number;
	comment?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface IReviewPaginationMeta {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export interface IPaginatedReviews {
	data: IReview[];
	pagination: IReviewPaginationMeta;
}

export interface IReviewFilters {
	page?: number;
	limit?: number;
}

export interface ICreateReviewPayload {
	productId: string;
	rating: number;
	comment?: string;
}

export interface IUpdateReviewPayload {
	rating?: number;
	comment?: string;
	isActive?: boolean;
}
