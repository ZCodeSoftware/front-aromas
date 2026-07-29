import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ICreateOrderPayload, IOrder } from '../models/order.interface';

const createOrder = async (payload: ICreateOrderPayload): Promise<IOrder> => {
	const response = await AppApiGateWay.post('/order', payload);
	return response.data;
};

export const orderPostService = {
	createOrder,
};
