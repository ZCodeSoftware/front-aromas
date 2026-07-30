import { AppApiGateWay } from '@/services/app.api.gateway';
import type {
	IAddress,
	ICreateAddressPayload,
} from '../models/address.interface';

const updateAddress = async (
	id: string,
	payload: Partial<ICreateAddressPayload>
): Promise<IAddress> => {
	const response = await AppApiGateWay.put(`/address/${id}`, payload);
	return response.data;
};

export const addressPutService = {
	updateAddress,
};
