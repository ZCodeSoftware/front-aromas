import type { ICategoryForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/category-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const postCategory = async (category: Partial<ICategoryForm>) => {
	try {
		await AppApiGateWayNoJWT.post('/cat-category', category);
	} catch (error) {
		console.error('Error al crear la categoría', error);
	}
};
