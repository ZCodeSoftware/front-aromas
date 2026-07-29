import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putPaymentMethod = async (id: string, paymentMethod: INamedForm) => {
	try {
		await AppApiGateWay.put(`/cat-payment-method/${id}`, paymentMethod);
	} catch (error) {
		console.error('Error al modificar el método de pago', error);
	}
};
