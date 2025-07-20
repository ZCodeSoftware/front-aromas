import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const postBrand = async (brand: INamedForm) => {
	try {
		await AppApiGateWayNoJWT.post('/cat-brand', brand);
	} catch (error) {
		console.error('Error al crear la marca', error);
	}
};
