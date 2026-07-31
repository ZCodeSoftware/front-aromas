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

export type IOrderItemType = 'PRODUCT' | 'COMBO';

/** One component of a purchased combo, as snapshotted on the line. */
export interface IOrderItemComponent {
	product: IOrderItemProduct | null;
	name: string;
	/** Units per single combo, not per order line. */
	quantity: number;
	unitPrice: number;
}

/** Which promotion took how much off, snapshotted so history never changes. */
export interface IOrderAppliedPromotion {
	promotion: string;
	code?: string | null;
	name: string;
	valueType: 'PERCENTAGE' | 'FIXED';
	value: number;
	scope: string;
	discount: number;
}

export interface IOrderItem {
	/** Missing on orders placed before combos existed; reads treat that as PRODUCT. */
	itemType?: IOrderItemType;
	product: IOrderItemProduct | null;
	combo?: IOrderItemProduct | null;
	components?: IOrderItemComponent[];
	name: string;
	unitPrice: number;
	quantity: number;
	/** Gross line amount, before any discount. */
	total: number;
	discount?: number;
	/** `total - discount`. Absent on orders placed before discounts existed. */
	netTotal?: number;
	appliedPromotions?: IOrderAppliedPromotion[];
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

/** Account behind an online order, as the API populates it. */
export interface IOrderUser {
	_id: string;
	firstName?: string | null;
	lastName?: string | null;
	email: string;
}

export interface IOrderCustomer {
	name?: string;
	email?: string;
	phone?: string;
	taxId?: string;
}

export interface IOrder {
	_id: string;
	/** Consecutive number shown to the customer, assigned by the API. */
	orderNumber: number;
	items: IOrderItem[];
	/** Gross sum of the lines, before discounts. */
	subTotalPrice: number;
	/** Absent on orders placed before discounts existed. */
	discountTotal?: number;
	appliedPromotions?: IOrderAppliedPromotion[];
	/** The coupon code actually redeemed, if any. */
	coupon?: string | null;
	shippingPrice: number;
	totalPrice: number;
	paymentMethod: IOrderPaymentMethod | null;
	shippingType: IShippingType;
	shippingAddress: IOrderShippingAddress | null;
	status: IOrderStatus;
	channel?: IOrderChannel;
	user?: IOrderUser | null;
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
	/** A code that cannot be applied fails the request, unlike in the preview. */
	couponCode?: string;
}
