import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putBrand = async (id: string, brand: INamedForm) => {
	try {
		await AppApiGateWay.put(`/cat-brand/${id}`, brand);
	} catch (error) {
		console.error('Error al modificar la marca', error);
	}
};
