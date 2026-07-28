import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IUserProfile } from '../models/user.interface';

const getMyProfile = async (): Promise<IUserProfile> => {
	const response = await AppApiGateWay.get('/user/detail');
	return response.data;
};

export const userGetService = {
	getMyProfile,
};
