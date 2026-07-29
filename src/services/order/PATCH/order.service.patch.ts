import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IOrder, IOrderStatus } from '../models/order.interface';

const cancelOrder = async (id: string): Promise<IOrder> => {
	const response = await AppApiGateWay.patch(`/order/${id}/cancel`);
	return response.data;
};

const changeOrderStatus = async (
	id: string,
	status: IOrderStatus
): Promise<IOrder> => {
	const response = await AppApiGateWay.patch(`/order/${id}/status`, {
		status,
	});
	return response.data;
};

export const orderPatchService = {
	cancelOrder,
	changeOrderStatus,
};
