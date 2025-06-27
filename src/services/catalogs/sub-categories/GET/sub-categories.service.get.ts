import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { ISubCategory } from '../models/sub-categories.interface';

const getSubCategories = async (): Promise<ISubCategory[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-sub-category`);
		return response.data;
	} catch (error) {
		console.error('Error fetching sub-categories:', error);
		throw error;
	}
};

export const subCategoriesGetService = {
	getSubCategories,
};
