import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { IEssence } from '../models/essences.interface';

const getEssences = async (): Promise<IEssence[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-essence`);
		return response.data;
	} catch (error) {
		console.error('Error fetching essences:', error);
		throw error;
	}
};

export const essencesGetService = {
	getEssences,
};
