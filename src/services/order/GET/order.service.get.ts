import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IPaginatedOrders } from '../models/order.interface';
import type { IOrderFilters } from '../models/order-filter.interface';

const getMyOrders = async (
	filters: IOrderFilters = {}
): Promise<IPaginatedOrders> => {
	const response = await AppApiGateWay.get('/order/me', { params: filters });
	return response.data;
};

export const orderGetService = {
	getMyOrders,
};
