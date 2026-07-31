import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IPromotionData } from '../models/promotions.interface';

/** Soft delete: the promotion is deactivated, never removed. */
export const deletePromotion = async (id: string): Promise<IPromotionData> => {
	const response = await AppApiGateWay.delete(`/promotion/${id}`);
	return response.data;
};
