import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IAddress } from '../models/address.interface';

const getAddressById = async (id: string): Promise<IAddress> => {
	const response = await AppApiGateWay.get(`/address/${id}`);
	return response.data;
};

export const addressGetService = {
	getAddressById,
};
