import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IReview, IUpdateReviewPayload } from '../models/review.interface';

const updateReview = async (
	id: string,
	payload: IUpdateReviewPayload
): Promise<IReview> => {
	const response = await AppApiGateWay.put(`/review/${id}`, payload);
	return response.data;
};

export const reviewPutService = {
	updateReview,
};
