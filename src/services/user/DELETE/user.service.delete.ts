import { AppApiGateWay } from '@/services/app.api.gateway';

const deleteUser = async (id: string): Promise<void> => {
	await AppApiGateWay.delete(`/user/${id}`);
};

export const userDeleteService = {
	deleteUser,
};
