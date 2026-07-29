import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IBrand } from '../models/brands.interface';

const deleteBrand = async (id: string): Promise<IBrand> => {
	const response = await AppApiGateWay.delete(`/cat-brand/${id}`);
	return response.data;
};

export const brandsDeleteService = {
	deleteBrand,
};
