import { AppApiGateWay } from '@/services/app.api.gateway';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { IPaginatedReviews, IReviewFilters } from '../models/review.interface';

const getMyReviews = async (
	filters: IReviewFilters = {}
): Promise<IPaginatedReviews> => {
	const response = await AppApiGateWay.get('/review/me', { params: filters });
	return response.data;
};

const getProductReviews = async (
	productId: string,
	filters: IReviewFilters = {}
): Promise<IPaginatedReviews> => {
	try {
		const response = await AppApiGateWayNoJWT(`/review/product/${productId}`, {
			params: filters,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching product reviews:', error);
		throw error;
	}
};

export const reviewGetService = {
	getMyReviews,
	getProductReviews,
};
