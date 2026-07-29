import type { IProductForm } from '@/pages/dashboard/components/dashboardProducts/createProduct/models/product-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putProduct = async (
	id: string,
	product: Partial<IProductForm>,
) => {
	try {
		await AppApiGateWay.put(`/product/${id}`, product);
	} catch (error) {
		console.error('Error al modificar producto', error);
	}
};
