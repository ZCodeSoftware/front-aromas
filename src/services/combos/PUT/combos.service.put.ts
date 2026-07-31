import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IComboData, IComboPayload } from '../models/combos.interface';

export const putCombo = async (
	id: string,
	combo: Partial<IComboPayload>
): Promise<IComboData> => {
	const response = await AppApiGateWay.put(`/combo/${id}`, combo);
	return response.data;
};
