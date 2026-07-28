import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { ITypeHousing } from '../models/type-housing.interface';

const getTypeHousings = async (): Promise<ITypeHousing[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-type-housing`);
		return response.data;
	} catch (error) {
		console.error('Error fetching type housings:', error);
		throw error;
	}
};

export const typeHousingGetService = {
	getTypeHousings,
};
