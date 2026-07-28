import type { IOrderStatus } from './order.interface';

export interface IOrderFilters {
	page?: number;
	limit?: number;
	status?: IOrderStatus;
}
