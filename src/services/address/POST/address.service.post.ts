import { AppApiGateWay } from '@/services/app.api.gateway';
import type {
	IAddress,
	ICreateAddressPayload,
} from '../models/address.interface';

const createAddress = async (
	payload: ICreateAddressPayload
): Promise<IAddress> => {
	const response = await AppApiGateWay.post('/address', payload);
	return response.data;
};

export const addressPostService = {
	createAddress,
};
