import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IOrder } from '@/services/order/models/order.interface';

const refundSale = async (id: string): Promise<IOrder> => {
	const response = await AppApiGateWay.patch(`/pos/sale/${id}/refund`);
	return response.data;
};

export const posPatchService = {
	refundSale,
};
