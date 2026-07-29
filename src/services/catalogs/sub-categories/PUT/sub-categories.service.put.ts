import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putSubCategory = async (id: string, subCategory: INamedForm) => {
	try {
		await AppApiGateWay.put(`/cat-sub-category/${id}`, subCategory);
	} catch (error) {
		console.error('Error al modificar la sub-categoría', error);
	}
};
