import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IOrder } from '../models/order.interface';

const cancelOrder = async (id: string): Promise<IOrder> => {
	const response = await AppApiGateWay.patch(`/order/${id}/cancel`);
	return response.data;
};

export const orderPatchService = {
	cancelOrder,
};
