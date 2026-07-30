import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IOrder, IOrderStatusCode } from '../models/order.interface';

const cancelOrder = async (id: string): Promise<IOrder> => {
	const response = await AppApiGateWay.patch(`/order/${id}/cancel`);
	return response.data;
};

/** The endpoint takes the status code, not the id of the catalogue row. */
const changeOrderStatus = async (
	id: string,
	status: IOrderStatusCode
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
