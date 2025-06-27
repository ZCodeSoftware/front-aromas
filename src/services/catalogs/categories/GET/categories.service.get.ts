import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { ICategory } from '../models/categories.interface';

const getCategories = async (): Promise<ICategory[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-category`);
		return response.data;
	} catch (error) {
		console.error('Error fetching categories:', error);
		throw error;
	}
};

export const categoriesGetService = {
	getCategories,
};
