import type { IColorForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/color-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const postColor = async (color: IColorForm) => {
	try {
		await AppApiGateWayNoJWT.post('/cat-color', color);
	} catch (error) {
		console.error('Error al crear el color', error);
	}
};
