import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IRole } from '../models/role.interface';

const getRoles = async (): Promise<IRole[]> => {
	try {
		const response = await AppApiGateWay.get('/cat-role');
		return response.data;
	} catch (error) {
		console.error('Error fetching roles:', error);
		throw error;
	}
};

export const roleGetService = {
	getRoles,
};
