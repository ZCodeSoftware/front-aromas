import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IUserProfile } from '../models/user.interface';

const getMyProfile = async (): Promise<IUserProfile> => {
	const response = await AppApiGateWay.get('/user/detail');
	return response.data;
};

const getAllUsers = async (): Promise<IUserProfile[]> => {
	const response = await AppApiGateWay.get('/user');
	return response.data;
};

/**
 * Admin listing: the same users as `getAllUsers` plus the deactivated ones, so the
 * dashboard can reactivate them.
 */
const getAllUsersIncludingInactive = async (): Promise<IUserProfile[]> => {
	const response = await AppApiGateWay.get('/user/all');
	return response.data;
};

const getUserById = async (id: string): Promise<IUserProfile> => {
	const response = await AppApiGateWay.get(`/user/${id}`);
	return response.data;
};

export const userGetService = {
	getMyProfile,
	getAllUsers,
	getAllUsersIncludingInactive,
	getUserById,
};
