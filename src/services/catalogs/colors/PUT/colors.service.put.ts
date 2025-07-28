import type { IColorForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/color-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putColor = async (id: string, color: IColorForm) => {
	try {
		await AppApiGateWayNoJWT.put(`/cat-color/${id}`, color);
	} catch (error) {
		console.error('Error al modificar el color', error);
	}
};
