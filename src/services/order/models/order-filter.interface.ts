import type { IOrderChannel, IOrderStatusCode } from './order.interface';

export interface IOrderFilters {
	page?: number;
	limit?: number;
	/** The API filters by code, not by the id of the catalogue row. */
	status?: IOrderStatusCode;
}

export interface IAllOrdersFilters extends IOrderFilters {
	dateFrom?: string;
	dateTo?: string;
	userId?: string;
	channel?: IOrderChannel;
}
