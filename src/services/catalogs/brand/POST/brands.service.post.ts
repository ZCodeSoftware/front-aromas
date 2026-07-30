import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postBrand = async (brand: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-brand', brand);
	} catch (error) {
		console.error('Error al crear la marca', error);
	}
};
