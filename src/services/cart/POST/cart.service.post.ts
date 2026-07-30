import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IAddCartItemPayload, ICart } from '../models/cart.interface';

const addItem = async (payload: IAddCartItemPayload): Promise<ICart> => {
	const response = await AppApiGateWay.post('/cart/items', payload);
	return response.data;
};

export const cartPostService = {
	addItem,
};
