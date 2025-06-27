import type { IFilterOptions } from '@/pages/home/components/products-view/models/product-filter.interface';
import type { IProduct } from '../models/products.interface';
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

export const productsGetService = {
	getProducts,
};
