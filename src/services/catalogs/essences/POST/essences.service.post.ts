import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const postEssence = async (essence: INamedForm) => {
	try {
		await AppApiGateWayNoJWT.post('/cat-essence', essence);
	} catch (error) {
		console.error('Error al crear la esencia', error);
	}
};
