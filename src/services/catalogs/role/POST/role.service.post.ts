import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postRole = async (role: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-role', role);
	} catch (error) {
		console.error('Error al crear el rol', error);
	}
};
