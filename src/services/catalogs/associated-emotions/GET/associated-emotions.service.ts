import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { IAssociatedEmotion } from '../models/associated-emotion.interface';

const getAssociatedEmotions = async (): Promise<IAssociatedEmotion[]> => {
	try {
		const response = await AppApiGateWayNoJWT(`/cat-associated-emotion`);
		return response.data;
	} catch (error) {
		console.error('Error fetching associated emotions:', error);
		throw error;
	}
};

export const associatedEmotionsGetService = {
	getAssociatedEmotions,
};
