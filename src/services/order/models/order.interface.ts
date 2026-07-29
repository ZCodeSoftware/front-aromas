export type IOrderStatusCode =
	| 'PENDING'
	| 'PAID'
	| 'SHIPPED'
	| 'DELIVERED'
	| 'CANCELLED'
	| 'REFUNDED';

/** Row of the cat-order-status catalogue, as the API populates it on an order. */
export interface IOrderStatus {
	_id: string;
	code: IOrderStatusCode;
	name: string;
}

export type IOrderChannel = 'ONLINE' | 'POS';

export type IShippingType = 'PICKUP' | 'DELIVERY';

export interface IOrderItemProduct {
	_id: string;
	name: string;
	images: string[];
}

export interface IOrderItem {
	product: IOrderItemProduct | null;
	name: string;
	unitPrice: number;
	quantity: number;
	total: number;
}

export interface IOrderPaymentMethod {
	_id: string;
	name: string;
}

export interface IOrderShippingAddress {
	address: string;
	name?: string;
	street: string;
	number?: number;
	zipCode: string;
	description?: string;
	floorAddress?: string;
}

export interface IOrderCustomer {
	name?: string;
	email?: string;
	phone?: string;
	taxId?: string;
}

export interface IOrder {
	_id: string;
	items: IOrderItem[];
	subTotalPrice: number;
	shippingPrice: number;
	totalPrice: number;
	paymentMethod: IOrderPaymentMethod | null;
	shippingType: IShippingType;
	shippingAddress: IOrderShippingAddress | null;
	status: IOrderStatus;
	channel?: IOrderChannel;
	user?: string | null;
	customer?: IOrderCustomer | null;
	createdAt: string;
	updatedAt: string;
}

export interface IPaginationMeta {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export interface IPaginatedOrders {
	data: IOrder[];
	pagination: IPaginationMeta;
}

export interface ICreateOrderPayload {
	paymentMethod: string;
	shippingType: IShippingType;
	addressId?: string;
	shippingPrice?: number;
}
