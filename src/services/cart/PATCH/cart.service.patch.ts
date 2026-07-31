import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ICart } from '../models/cart.interface';

const updateItemQuantity = async (
	productId: string,
	quantity: number
): Promise<ICart> => {
	const response = await AppApiGateWay.patch(`/cart/items/${productId}`, {
		quantity,
	});
	return response.data;
};

/**
 * Combo lines have their own route rather than sharing `items/:id`: the two ids
 * come from different collections and one route would have to guess which.
 */
const updateComboQuantity = async (
	comboId: string,
	quantity: number
): Promise<ICart> => {
	const response = await AppApiGateWay.patch(`/cart/combo-items/${comboId}`, {
		quantity,
	});
	return response.data;
};

export const cartPatchService = {
	updateItemQuantity,
	updateComboQuantity,
};
