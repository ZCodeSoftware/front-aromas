import type { IOrderStatusCode } from '@/services/order/models/order.interface';

export interface IPosSaleItemPayload {
	productId: string;
	quantity: number;
}

export interface IPosCustomerPayload {
	name?: string;
	email?: string;
	phone?: string;
	taxId?: string;
}

export interface ICreatePosSalePayload {
	items: IPosSaleItemPayload[];
	paymentMethod: string;
	userId?: string;
	customer?: IPosCustomerPayload;
}

export interface IPosSaleFilters {
	page?: number;
	limit?: number;
	/** The API filters by code, not by the id of the catalogue row. */
	status?: IOrderStatusCode;
	dateFrom?: string;
	dateTo?: string;
	soldBy?: string;
}
