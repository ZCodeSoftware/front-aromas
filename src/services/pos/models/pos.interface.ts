import type { IOrderStatusCode } from '@/services/order/models/order.interface';

/** Exactly one of productId / comboId; the API rejects both or neither. */
export interface IPosSaleItemPayload {
	productId?: string;
	comboId?: string;
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
	/** A code that cannot be applied fails the sale, unlike in the preview. */
	couponCode?: string;
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
