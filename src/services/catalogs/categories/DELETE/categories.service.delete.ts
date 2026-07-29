import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ICategory } from '../models/categories.interface';

const deleteCategory = async (id: string): Promise<ICategory> => {
	const response = await AppApiGateWay.delete(`/cat-category/${id}`);
	return response.data;
};

export const categoriesDeleteService = {
	deleteCategory,
};
