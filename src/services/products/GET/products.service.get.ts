import type { IFilterOptions } from '@/pages/home/components/products-view/models/product-filter.interface';
import type { IProduct } from '../models/products.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

const getProducts = async (
	filters: Partial<IFilterOptions> = {}
): Promise<IProduct> => {
	try {
		const response = await AppApiGateWayNoJWT(`/product`, {
			params: filters,
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching products:', error);
		throw error;
	}
};

/**
 * Admin listing: the same filters as the public one plus the deactivated products,
 * so the dashboard can switch them back on. Requires an admin token.
 */
const getProductsIncludingInactive = async (
	filters: Partial<IFilterOptions> = {}
): Promise<IProduct> => {
	const response = await AppApiGateWay.get(`/product/all`, {
		params: filters,
	});
	return response.data;
};

export const productsGetService = {
	getProducts,
	getProductsIncludingInactive,
};
