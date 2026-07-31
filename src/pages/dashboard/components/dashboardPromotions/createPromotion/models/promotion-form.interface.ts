import type {
	PromotionScope,
	PromotionValueType,
} from '@/services/promotions/models/promotions.interface';

/**
 * The form keeps every scope list at once, not just the active one, so switching
 * back and forth does not lose what the admin already picked.
 */
export interface IPromotionForm {
	name: string;
	description: string;
	scope: PromotionScope;
	categories: string[];
	subCategories: string[];
	products: string[];
	combos: string[];
	valueType: PromotionValueType;
	value: number;
	/** Empty means automatic: it applies on its own, with nothing to type in. */
	code: string;
	/** `datetime-local` values, converted to ISO only on submit. */
	startsAt: string;
	endsAt: string;
	minPurchase: number;
	usageLimit: number;
	usageLimitPerUser: number;
	isActive: boolean;
}

export interface IPromotionFormErrors {
	name: string;
	value: string;
	scope: string;
	code: string;
	dates: string;
}
