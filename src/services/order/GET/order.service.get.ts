import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IOrder, IPaginatedOrders } from '../models/order.interface';
import type {
	IAllOrdersFilters,
	IOrderFilters,
} from '../models/order-filter.interface';

const getMyOrders = async (
	filters: IOrderFilters = {}
): Promise<IPaginatedOrders> => {
	const response = await AppApiGateWay.get('/order/me', { params: filters });
	return response.data;
};

const getAllOrders = async (
	filters: IAllOrdersFilters = {}
): Promise<IPaginatedOrders> => {
	const response = await AppApiGateWay.get('/order', { params: filters });
	return response.data;
};

const getOrderById = async (id: string): Promise<IOrder> => {
	const response = await AppApiGateWay.get(`/order/${id}`);
	return response.data;
};

export const orderGetService = {
	getMyOrders,
	getAllOrders,
	getOrderById,
};
