import { AppApiGateWay } from '@/services/app.api.gateway';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type {
	IPromotion,
	IPromotionData,
	IPromotionFilters,
} from '../models/promotions.interface';

const getPromotions = async (
	filters: IPromotionFilters = {}
): Promise<IPromotion> => {
	const response = await AppApiGateWay.get(`/promotion`, { params: filters });
	return response.data;
};

/** Admin listing: adds the deactivated promotions so they can be switched back on. */
const getPromotionsIncludingInactive = async (
	filters: IPromotionFilters = {}
): Promise<IPromotion> => {
	const response = await AppApiGateWay.get(`/promotion/all`, {
		params: filters,
	});
	return response.data;
};

/**
 * Public. Only the promotions that apply on their own — coupons are never listed,
 * which would hand every code away.
 */
const getActivePromotions = async (): Promise<IPromotionData[]> => {
	const response = await AppApiGateWayNoJWT(`/promotion/active`);
	return response.data;
};

export const promotionsGetService = {
	getPromotions,
	getPromotionsIncludingInactive,
	getActivePromotions,
};
