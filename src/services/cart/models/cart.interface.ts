export interface ICartItemProduct {
	_id: string;
	name: string;
	price: number;
	stock: number;
	images: string[];
	isActive: boolean;
}

export interface ICartItem {
	product: ICartItemProduct | null;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface ICart {
	_id: string;
	user: string;
	items: ICartItem[];
	totalPrice: number;
	createdAt: string;
	updatedAt: string;
}

export interface IAddCartItemPayload {
	productId: string;
	quantity: number;
}

export interface IUpdateCartItemPayload {
	quantity: number;
}
