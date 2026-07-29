import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IReview } from '../models/review.interface';

const deleteReview = async (id: string): Promise<IReview> => {
	const response = await AppApiGateWay.delete(`/review/${id}`);
	return response.data;
};

export const reviewDeleteService = {
	deleteReview,
};
