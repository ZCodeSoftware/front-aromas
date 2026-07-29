import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IPaginatedOrders } from '@/services/order/models/order.interface';
import type { IPosSaleFilters } from '../models/pos.interface';

const getSales = async (
	filters: IPosSaleFilters = {}
): Promise<IPaginatedOrders> => {
	const response = await AppApiGateWay.get('/pos/sale', { params: filters });
	return response.data;
};

export const posGetService = {
	getSales,
};
