import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postPaymentMethod = async (paymentMethod: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-payment-method', paymentMethod);
	} catch (error) {
		console.error('Error al crear el método de pago', error);
	}
};
