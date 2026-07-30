import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putEssence = async (id: string, essence: INamedForm) => {
	try {
		await AppApiGateWay.put(`/cat-essence/${id}`, essence);
	} catch (error) {
		console.error('Error al modificar la esencia', error);
	}
};
