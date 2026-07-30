import type { IProductForm } from '@/pages/dashboard/components/dashboardProducts/createProduct/models/product-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postProduct = async (product: Partial<IProductForm>) => {
	try {
		await AppApiGateWay.post('/product', product);
	} catch (error) {
		console.error('Error al crear producto', error);
	}
};
