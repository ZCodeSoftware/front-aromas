import type { IOrderStatusCode } from './order.interface';

export interface IOrderFilters {
	page?: number;
	limit?: number;
	/** The API filters by code, not by the id of the catalogue row. */
	status?: IOrderStatusCode;
}
