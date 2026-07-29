import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putTypeHousing = async (id: string, typeHousing: INamedForm) => {
	try {
		await AppApiGateWay.put(`/cat-type-housing/${id}`, typeHousing);
	} catch (error) {
		console.error('Error al modificar el tipo de vivienda', error);
	}
};
