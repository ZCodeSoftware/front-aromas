import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const postSubCategory = async (subCategory: INamedForm) => {
	try {
		await AppApiGateWayNoJWT.post('/cat-sub-category', subCategory);
	} catch (error) {
		console.error('Error al crear la sub-categoría', error);
	}
};
