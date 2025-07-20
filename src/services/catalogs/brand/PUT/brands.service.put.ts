import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putBrand = async (id: string, brand: INamedForm) => {
	try {
		await AppApiGateWayNoJWT.put(`/cat-brand/${id}`, brand);
	} catch (error) {
		console.error('Error al modificar la marca', error);
	}
};
