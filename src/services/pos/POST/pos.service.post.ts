import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IOrder } from '@/services/order/models/order.interface';
import type { ICreatePosSalePayload } from '../models/pos.interface';

const registerSale = async (payload: ICreatePosSalePayload): Promise<IOrder> => {
	const response = await AppApiGateWay.post('/pos/sale', payload);
	return response.data;
};

export const posPostService = {
	registerSale,
};
