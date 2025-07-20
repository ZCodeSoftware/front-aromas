import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putSubCategory = async (id: string, subCategory: INamedForm) => {
	try {
		await AppApiGateWayNoJWT.put(`/cat-sub-category/${id}`, subCategory);
	} catch (error) {
		console.error('Error al modificar la sub-categoría', error);
	}
};
