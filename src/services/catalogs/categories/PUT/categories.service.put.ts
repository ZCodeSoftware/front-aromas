import type { ICategoryForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/category-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putCategory = async (
	id: string,
	category: Partial<ICategoryForm>,
) => {
	try {
		await AppApiGateWay.put(`/cat-category/${id}`, category);
	} catch (error) {
		console.error('Error al modificar la categoría', error);
	}
};
