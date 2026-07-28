import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IUserProfile } from '../models/user.interface';
import type { IUpdateUserPayload } from '../models/update-user-payload.interface';

const updateMyProfile = async (
	payload: Partial<IUpdateUserPayload>
): Promise<IUserProfile> => {
	const response = await AppApiGateWay.put('/user/me', payload);
	return response.data;
};

export const userPutService = {
	updateMyProfile,
};
