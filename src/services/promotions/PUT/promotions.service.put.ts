import { AppApiGateWay } from '@/services/app.api.gateway';
import type {
	IPromotionData,
	IPromotionPayload,
} from '../models/promotions.interface';

export const putPromotion = async (
	id: string,
	promotion: Partial<IPromotionPayload>
): Promise<IPromotionData> => {
	const response = await AppApiGateWay.put(`/promotion/${id}`, promotion);
	return response.data;
};
