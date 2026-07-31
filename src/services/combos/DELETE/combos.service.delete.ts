import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IComboData } from '../models/combos.interface';

/** Soft delete: the combo is deactivated, never removed. */
export const deleteCombo = async (id: string): Promise<IComboData> => {
	const response = await AppApiGateWay.delete(`/combo/${id}`);
	return response.data;
};
