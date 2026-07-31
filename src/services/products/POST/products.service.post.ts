import type { IProductForm } from '@/pages/dashboard/components/dashboardProducts/createProduct/models/product-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postProduct = async (product: Partial<IProductForm>) => {
	// Rethrown so the caller can tell the user it failed instead of reporting
	// success: swallowing it here made the form show "creado con éxito" on a
	// request the API had rejected.
	await AppApiGateWay.post('/product', product);
};
