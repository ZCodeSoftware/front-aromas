import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IEssence } from '../models/essences.interface';

const deleteEssence = async (id: string): Promise<IEssence> => {
	const response = await AppApiGateWay.delete(`/cat-essence/${id}`);
	return response.data;
};

export const essencesDeleteService = {
	deleteEssence,
};
