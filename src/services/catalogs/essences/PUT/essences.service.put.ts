import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putEssence = async (id: string, essence: INamedForm) => {
	try {
		await AppApiGateWayNoJWT.put(`/cat-essence/${id}`, essence);
	} catch (error) {
		console.error('Error al modificar la esencia', error);
	}
};
