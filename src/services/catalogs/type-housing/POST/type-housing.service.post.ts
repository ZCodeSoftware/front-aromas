import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postTypeHousing = async (typeHousing: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-type-housing', typeHousing);
	} catch (error) {
		console.error('Error al crear el tipo de vivienda', error);
	}
};
