import type { ICategoryForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/category-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postCategory = async (category: Partial<ICategoryForm>) => {
	try {
		await AppApiGateWay.post('/cat-category', category);
	} catch (error) {
		console.error('Error al crear la categoría', error);
	}
};
