import type { IColorForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/color-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putColor = async (id: string, color: IColorForm) => {
	try {
		await AppApiGateWay.put(`/cat-color/${id}`, color);
	} catch (error) {
		console.error('Error al modificar el color', error);
	}
};
