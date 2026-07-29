import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IPaymentMethod } from '../models/payment-method.interface';

const deletePaymentMethod = async (id: string): Promise<IPaymentMethod> => {
	const response = await AppApiGateWay.delete(`/cat-payment-method/${id}`);
	return response.data;
};

export const paymentMethodDeleteService = {
	deletePaymentMethod,
};
