import { AppApiGateWay } from '@/services/app.api.gateway';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type {
	ICombo,
	IComboData,
	IComboFilters,
} from '../models/combos.interface';

const getCombos = async (filters: IComboFilters = {}): Promise<ICombo> => {
	const response = await AppApiGateWayNoJWT(`/combo`, { params: filters });
	return response.data;
};

/**
 * Admin listing: the same filters as the public one plus the deactivated combos,
 * so the dashboard can switch them back on. Requires an admin token.
 */
const getCombosIncludingInactive = async (
	filters: IComboFilters = {}
): Promise<ICombo> => {
	const response = await AppApiGateWay.get(`/combo/all`, { params: filters });
	return response.data;
};

const getComboById = async (id: string): Promise<IComboData> => {
	const response = await AppApiGateWayNoJWT(`/combo/${id}`);
	return response.data;
};

export const combosGetService = {
	getCombos,
	getCombosIncludingInactive,
	getComboById,
};
