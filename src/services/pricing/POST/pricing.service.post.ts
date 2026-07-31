import { AppApiGateWay } from '@/services/app.api.gateway';
import type {
	IPreviewOrderPayload,
	IPreviewPosSalePayload,
	IPricingResult,
} from '../models/pricing.interface';

/** Prices the cart of the authenticated user without creating anything. */
const previewOrder = async (
	payload: IPreviewOrderPayload = {}
): Promise<IPricingResult> => {
	const response = await AppApiGateWay.post('/order/preview', payload);
	return response.data;
};

/** Prices a counter sale before the money is taken. */
const previewPosSale = async (
	payload: IPreviewPosSalePayload
): Promise<IPricingResult> => {
	const response = await AppApiGateWay.post('/pos/preview', payload);
	return response.data;
};

export const pricingPostService = {
	previewOrder,
	previewPosSale,
};
