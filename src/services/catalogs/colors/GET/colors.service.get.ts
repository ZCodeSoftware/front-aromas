import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { IColor } from '../models/colors.interface';

const getColors = async (): Promise<IColor[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-color`);
		return response.data;
	} catch (error) {
		console.error('Error fetching colors:', error);
		throw error;
	}
};

export const colorsGetService = {
	getColors,
};
