import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IComboData, IComboPayload } from '../models/combos.interface';

export const postCombo = async (combo: IComboPayload): Promise<IComboData> => {
	// Deliberately not caught here: swallowing the error would make the form
	// report success on a request that failed.
	const response = await AppApiGateWay.post('/combo', combo);
	return response.data;
};
