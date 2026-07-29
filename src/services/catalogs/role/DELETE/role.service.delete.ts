import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IRole } from '../models/role.interface';

const deleteRole = async (id: string): Promise<IRole> => {
	const response = await AppApiGateWay.delete(`/cat-role/${id}`);
	return response.data;
};

export const roleDeleteService = {
	deleteRole,
};
