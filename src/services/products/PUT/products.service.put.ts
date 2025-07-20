import type { IProductForm } from '@/pages/dashboard/components/dashboardProducts/createProduct/models/product-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putProduct = async (
	id: string,
	product: Partial<IProductForm>
) => {
	try {
		await AppApiGateWayNoJWT.put(`/product/${id}`, product);
	} catch (error) {
		console.error('Error al modificar producto', error);
	}
};
