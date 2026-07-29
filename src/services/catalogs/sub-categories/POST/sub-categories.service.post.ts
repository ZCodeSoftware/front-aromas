import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postSubCategory = async (subCategory: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-sub-category', subCategory);
	} catch (error) {
		console.error('Error al crear la sub-categoría', error);
	}
};
