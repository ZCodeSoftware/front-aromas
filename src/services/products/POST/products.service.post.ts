import type { IProductForm } from '@/pages/dashboard/components/dashboardProducts/createProduct/models/product-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const postProduct = async (product: Partial<IProductForm>) => {
	try {
		await AppApiGateWayNoJWT.post('/product', product);
	} catch (error) {
		console.error('Error al crear producto', error);
	}
};
