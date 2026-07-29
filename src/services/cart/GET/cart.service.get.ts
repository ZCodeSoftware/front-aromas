import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ICart } from '../models/cart.interface';

const getMyCart = async (): Promise<ICart> => {
	const response = await AppApiGateWay.get('/cart');
	return response.data;
};

export const cartGetService = {
	getMyCart,
};
