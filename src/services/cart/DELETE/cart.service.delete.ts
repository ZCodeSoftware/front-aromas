import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ICart } from '../models/cart.interface';

const removeItem = async (productId: string): Promise<ICart> => {
	const response = await AppApiGateWay.delete(`/cart/items/${productId}`);
	return response.data;
};

const removeCombo = async (comboId: string): Promise<ICart> => {
	const response = await AppApiGateWay.delete(`/cart/combo-items/${comboId}`);
	return response.data;
};

const clearCart = async (): Promise<ICart> => {
	const response = await AppApiGateWay.delete('/cart');
	return response.data;
};

export const cartDeleteService = {
	removeItem,
	removeCombo,
	clearCart,
};
