import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ICreateReviewPayload, IReview } from '../models/review.interface';

const createReview = async (payload: ICreateReviewPayload): Promise<IReview> => {
	const response = await AppApiGateWay.post('/review', payload);
	return response.data;
};

export const reviewPostService = {
	createReview,
};
