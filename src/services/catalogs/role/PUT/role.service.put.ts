import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putRole = async (id: string, role: INamedForm) => {
	try {
		await AppApiGateWay.put(`/cat-role/${id}`, role);
	} catch (error) {
		console.error('Error al modificar el rol', error);
	}
};
