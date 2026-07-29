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

export const cartPatchService = {
	updateItemQuantity,
};
