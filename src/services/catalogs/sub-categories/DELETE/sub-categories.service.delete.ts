import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ISubCategory } from '../models/sub-categories.interface';

const deleteSubCategory = async (id: string): Promise<ISubCategory> => {
	const response = await AppApiGateWay.delete(`/cat-sub-category/${id}`);
	return response.data;
};

export const subCategoriesDeleteService = {
	deleteSubCategory,
};
