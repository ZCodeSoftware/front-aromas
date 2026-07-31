import type {
	PromotionScope,
	PromotionValueType,
} from '@/services/promotions/models/promotions.interface';

export interface IAppliedPromotion {
	promotion: string;
	code: string | null;
	name: string;
	valueType: PromotionValueType;
	value: number;
	scope: PromotionScope;
	discount: number;
}

export interface IPricedLine {
	/** Index of the line within the request, as a string. */
	ref: string;
	discount: number;
	netTotal: number;
	appliedPromotions: IAppliedPromotion[];
}

/**
 * What the backend says a sale costs. The authoritative figures: anything the
 * storefront estimates on its own is only there to avoid a blank price.
 */
export interface IPricingResult {
	subTotalPrice: number;
	discountTotal: number;
	shippingPrice: number;
	totalPrice: number;
	lines: IPricedLine[];
	appliedPromotions: IAppliedPromotion[];
	coupon: { code: string; promotion: string } | null;
	/** Why the coupon was rejected. Only ever present on a preview. */
	couponError?: string;
}

export interface IPreviewOrderPayload {
	couponCode?: string;
	shippingPrice?: number;
}

export interface IPreviewPosSalePayload {
	items: { productId?: string; comboId?: string; quantity: number }[];
	userId?: string;
	couponCode?: string;
}
