export type CartItemType = 'PRODUCT' | 'COMBO';

export interface ICartItemProduct {
	_id: string;
	name: string;
	price: number;
	stock: number;
	images: string[];
	isActive: boolean;
}

/** A combo as the cart returns it: only its display fields are populated. */
export interface ICartItemCombo {
	_id: string;
	name: string;
	images: string[];
	isActive: boolean;
}

export interface ICartItem {
	/** Missing on lines written before combos existed; reads treat that as PRODUCT. */
	itemType?: CartItemType;
	product: ICartItemProduct | null;
	combo?: ICartItemCombo | null;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface ICart {
	_id: string;
	user: string;
	items: ICartItem[];
	totalPrice: number;
	couponCode: string | null;
	createdAt: string;
	updatedAt: string;
}

/** Exactly one of productId / comboId; the API rejects both or neither. */
export interface IAddCartItemPayload {
	productId?: string;
	comboId?: string;
	quantity: number;
}

export interface IUpdateCartItemPayload {
	quantity: number;
}
