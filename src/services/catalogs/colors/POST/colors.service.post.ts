import type { IColorForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/color-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postColor = async (color: IColorForm) => {
	try {
		await AppApiGateWay.post('/cat-color', color);
	} catch (error) {
		console.error('Error al crear el color', error);
	}
};
