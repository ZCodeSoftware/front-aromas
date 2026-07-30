export type IGroupBy = 'day' | 'week' | 'month';

export type IMetricScope = 'RANGE' | 'SNAPSHOT' | 'LIFETIME';

export interface IAnalyticsRangeQuery {
	dateFrom?: string;
	dateTo?: string;
	timezone?: string;
}

export interface ISalesTimeSeriesQuery extends IAnalyticsRangeQuery {
	groupBy?: IGroupBy;
}

export interface IInventoryQuery extends IAnalyticsRangeQuery {
	lowStockThreshold?: number;
	limit?: number;
}

export interface ICustomersQuery extends IAnalyticsRangeQuery {
	limit?: number;
}

export interface IConversionQuery extends IAnalyticsRangeQuery {
	abandonedAfterHours?: number;
}

export interface IRangeEcho {
	dateFrom: string;
	dateTo: string;
	timezone: string;
}

export interface IProductRef {
	_id: string;
	name?: string;
}

export interface IProductMetrics {
	product: IProductRef;
	seeTimes: number;
	sellTimes: number;
	addCartTimes: number;
}

export interface ITopProduct {
	product: IProductRef;
	value: number;
}

export interface ITopSoldProduct {
	product: IProductRef;
	name: string;
	quantity: number;
	revenue: number;
}

export interface IOrdersByStatus {
	status: string;
	count: number;
}

export interface ISalesSummary {
	totalOrders: number;
	revenue: number;
	paidOrders: number;
	paidRevenue: number;
	subTotal: number;
	shipping: number;
	ordersByStatus: IOrdersByStatus[];
	topSold: ITopSoldProduct[];
}

export interface IDashboard {
	range: IRangeEcho | null;
	catalogue: {
		totalProducts: number;
		totalUsers: number;
	};
	sales: ISalesSummary;
	engagement: {
		scope: IMetricScope;
		topViewed: ITopProduct[];
		topAddedToCart: ITopProduct[];
	};
}

export interface ISalesPoint {
	bucket: string;
	partial: boolean;
	orders: number;
	revenue: number;
	subTotal: number;
	shipping: number;
	paidOrders: number;
	paidRevenue: number;
	avgTicket: number;
	paidAvgTicket: number;
}

export interface ISalesTotals {
	orders: number;
	revenue: number;
	subTotal: number;
	shipping: number;
	paidOrders: number;
	paidRevenue: number;
	avgTicket: number;
	paidAvgTicket: number;
}

export interface ISalesTimeSeries {
	range: IRangeEcho;
	groupBy: IGroupBy;
	totals: ISalesTotals;
	points: ISalesPoint[];
}

export interface IChannelBucket {
	channel: string;
	orders: number;
	revenue: number;
	paidOrders: number;
	paidRevenue: number;
	share: number;
}

export interface IPaymentMethodBucket {
	paymentMethodId: string | null;
	name: string;
	orders: number;
	revenue: number;
	paidOrders: number;
	paidRevenue: number;
	share: number;
}

export interface IBreakdownCell {
	channel: string;
	paymentMethodId: string | null;
	name: string;
	orders: number;
	revenue: number;
	paidOrders: number;
	paidRevenue: number;
}

export interface ISalesBreakdown {
	range: IRangeEcho;
	totals: Omit<ISalesTotals, 'subTotal' | 'shipping' | 'avgTicket' | 'paidAvgTicket'>;
	byChannel: IChannelBucket[];
	byPaymentMethod: IPaymentMethodBucket[];
	matrix: IBreakdownCell[];
}

export interface IStockSummary {
	activeProducts: number;
	unitsInStock: number;
	inventoryValueAtSalePrice: number;
	outOfStockCount: number;
	lowStockCount: number;
}

export interface IStockProduct {
	_id: string;
	name: string;
	price: number;
	stock: number;
	images?: string[];
}

export interface IDeadStock {
	definition: string;
	range: IRangeEcho;
	count: number;
	valueAtSalePrice: number;
	items: IStockProduct[];
}

export interface IInventoryReport {
	generatedAt: string;
	scope: IMetricScope;
	summary: IStockSummary & { lowStockThreshold: number };
	lowStock: IStockProduct[];
	outOfStock: IStockProduct[];
	deadStock: IDeadStock;
}

export interface ITopCustomer {
	userId: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	orders: number;
	revenue: number;
	lastOrderAt: string;
}

export interface ICustomerCohorts {
	newCustomers: number;
	returningCustomers: number;
	ordersFromNew: number;
	ordersFromReturning: number;
	revenueFromNew: number;
	revenueFromReturning: number;
}

export interface IAnonymousSales {
	orders: number;
	revenue: number;
}

export interface ICustomersReport {
	range: IRangeEcho;
	topCustomers: ITopCustomer[];
	cohorts: ICustomerCohorts & { definition: string };
	anonymous: IAnonymousSales & { note: string };
}

export interface ICartSnapshot {
	cartsWithItems: number;
	abandonedCarts: number;
	abandonedValueAtCartPrices: number;
}

export interface IConversionReport {
	snapshotAt: string;
	range: IRangeEcho;
	carts: ICartSnapshot & {
		scope: IMetricScope;
		abandonedAfterHours: number;
		note: string;
	};
	orders: {
		scope: IMetricScope;
		ordersInRange: number;
		customerOrdersInRange: number;
		anonymousOrdersInRange: number;
	};
	lifetime: {
		scope: IMetricScope;
		addToCartEvents: number;
		soldUnits: number;
		addToCartToSaleRate: number;
		note: string;
	};
}
