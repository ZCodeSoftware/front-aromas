import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postEssence = async (essence: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-essence', essence);
	} catch (error) {
		console.error('Error al crear la esencia', error);
	}
};
