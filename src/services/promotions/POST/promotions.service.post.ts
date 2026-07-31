import { AppApiGateWay } from '@/services/app.api.gateway';
import type {
	IPromotionData,
	IPromotionPayload,
} from '../models/promotions.interface';

export const postPromotion = async (
	promotion: IPromotionPayload
): Promise<IPromotionData> => {
	// Deliberately not caught here: swallowing the error would make the form
	// report success on a request that failed.
	const response = await AppApiGateWay.post('/promotion', promotion);
	return response.data;
};
