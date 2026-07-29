import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IAssociatedEmotion } from '../models/associated-emotion.interface';

const deleteAssociatedEmotion = async (
	id: string
): Promise<IAssociatedEmotion> => {
	const response = await AppApiGateWay.delete(`/cat-associated-emotion/${id}`);
	return response.data;
};

export const associatedEmotionsDeleteService = {
	deleteAssociatedEmotion,
};
