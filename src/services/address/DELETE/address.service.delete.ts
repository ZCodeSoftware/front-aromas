import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IAddress } from '../models/address.interface';

const deleteAddress = async (id: string): Promise<IAddress> => {
	const response = await AppApiGateWay.delete(`/address/${id}`);
	return response.data;
};

export const addressDeleteService = {
	deleteAddress,
};
