import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { IBrand } from '../models/brands.interface';

const getBrands = async (): Promise<IBrand[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-brand`);
		return response.data;
	} catch (error) {
		console.error('Error fetching associated emotions:', error);
		throw error;
	}
};

export const brandsGetService = {
	getBrands,
};
