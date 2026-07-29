import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';
import type { IPaymentMethod } from '../models/payment-method.interface';

const getPaymentMethods = async (): Promise<IPaymentMethod[]> => {
	try {
		const response = await AppApiGateWayNoJWT('/cat-payment-method');
		return response.data;
	} catch (error) {
		console.error('Error fetching payment methods:', error);
		throw error;
	}
};

export const paymentMethodGetService = {
	getPaymentMethods,
};
