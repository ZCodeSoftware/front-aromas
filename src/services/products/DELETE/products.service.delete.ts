import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IProductData } from '../models/products.interface';

const deleteProduct = async (id: string): Promise<IProductData> => {
	const response = await AppApiGateWay.delete(`/product/${id}`);
	return response.data;
};

export const productsDeleteService = {
	deleteProduct,
};
