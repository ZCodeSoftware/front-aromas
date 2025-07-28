import type { ICategoryForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/category-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putCategory = async (
	id: string,
	category: Partial<ICategoryForm>
) => {
	try {
		await AppApiGateWayNoJWT.put(`/cat-category/${id}`, category);
	} catch (error) {
		console.error('Error al modificar la categoría', error);
	}
};
