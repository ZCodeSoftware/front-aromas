import { AppApiGateWay } from '@/services/app.api.gateway';
import type {
	IAnalyticsRangeQuery,
	IConversionQuery,
	IConversionReport,
	ICustomersQuery,
	ICustomersReport,
	IDashboard,
	IInventoryQuery,
	IInventoryReport,
	IProductMetrics,
	ISalesBreakdown,
	ISalesTimeSeries,
	ISalesTimeSeriesQuery,
} from '../models/analytics.interface';

const getDashboard = async (
	params: IAnalyticsRangeQuery = {}
): Promise<IDashboard> => {
	const response = await AppApiGateWay.get('/analytics/dashboard', {
		params,
	});
	return response.data;
};

const getProductAnalytics = async (
	productId: string
): Promise<IProductMetrics> => {
	const response = await AppApiGateWay.get(`/analytics/product/${productId}`);
	return response.data;
};

const getSalesTimeseries = async (
	params: ISalesTimeSeriesQuery = {}
): Promise<ISalesTimeSeries> => {
	const response = await AppApiGateWay.get('/analytics/sales/timeseries', {
		params,
	});
	return response.data;
};

const getSalesBreakdown = async (
	params: IAnalyticsRangeQuery = {}
): Promise<ISalesBreakdown> => {
	const response = await AppApiGateWay.get('/analytics/sales/breakdown', {
		params,
	});
	return response.data;
};

const getInventory = async (
	params: IInventoryQuery = {}
): Promise<IInventoryReport> => {
	const response = await AppApiGateWay.get('/analytics/inventory', {
		params,
	});
	return response.data;
};

const getCustomers = async (
	params: ICustomersQuery = {}
): Promise<ICustomersReport> => {
	const response = await AppApiGateWay.get('/analytics/customers', {
		params,
	});
	return response.data;
};

const getConversion = async (
	params: IConversionQuery = {}
): Promise<IConversionReport> => {
	const response = await AppApiGateWay.get('/analytics/conversion', {
		params,
	});
	return response.data;
};

export const analyticsGetService = {
	getDashboard,
	getProductAnalytics,
	getSalesTimeseries,
	getSalesBreakdown,
	getInventory,
	getCustomers,
	getConversion,
};
