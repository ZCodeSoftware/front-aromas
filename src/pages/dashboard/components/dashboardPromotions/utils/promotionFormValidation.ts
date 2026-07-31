import type {
	IPromotionForm,
	IPromotionFormErrors,
} from '../createPromotion/models/promotion-form.interface';
import type { IPromotionPayload } from '@/services/promotions/models/promotions.interface';

/** Which list a scope reads from. ALL reads from none. */
const SCOPE_FIELD: Partial<
	Record<IPromotionForm['scope'], keyof IPromotionForm>
> = {
	CATEGORY: 'categories',
	SUBCATEGORY: 'subCategories',
	PRODUCTS: 'products',
	COMBOS: 'combos',
};

const SCOPE_LABEL: Record<string, string> = {
	CATEGORY: 'categoría',
	SUBCATEGORY: 'sub-categoría',
	PRODUCTS: 'producto',
	COMBOS: 'combo',
};

/**
 * Mirrors the backend rules on purpose: the same pairings PromotionModel enforces,
 * so the form fails fast instead of letting the API be the first to say no.
 */
export const validatePromotionForm = (
	values: IPromotionForm
): IPromotionFormErrors => {
	const errors: IPromotionFormErrors = {
		name: '',
		value: '',
		scope: '',
		code: '',
		dates: '',
	};

	if (!values.name) {
		errors.name = 'El nombre es requerido.';
	} else if (values.name.length < 3 || values.name.length >= 100) {
		errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
	}

	if (!values.value || values.value <= 0) {
		errors.value = 'El descuento es requerido y debe ser mayor a 0.';
	} else if (values.valueType === 'PERCENTAGE' && values.value > 100) {
		errors.value = 'Un descuento porcentual no puede superar 100.';
	}

	const scopeField = SCOPE_FIELD[values.scope];
	if (scopeField && !(values[scopeField] as string[]).length) {
		errors.scope = `Seleccioná al menos una ${SCOPE_LABEL[values.scope]}.`;
	}

	if (values.code && !/^[A-Z0-9_-]+$/.test(values.code.trim().toUpperCase())) {
		errors.code = 'El código solo admite letras, números, guiones y guiones bajos.';
	} else if (values.code && values.code.trim().length < 3) {
		errors.code = 'El código debe tener al menos 3 caracteres.';
	}

	if (values.startsAt && values.endsAt && values.startsAt > values.endsAt) {
		errors.dates = 'La promoción no puede terminar antes de empezar.';
	}

	return errors;
};

/**
 * Turns the form into the request body. Only the list its scope reads is sent, so
 * a leftover selection from another scope never reaches the API, and the optional
 * numbers are dropped when left at zero rather than sent as a real limit of 0.
 */
export const toPromotionPayload = (
	values: IPromotionForm
): IPromotionPayload => {
	const scopeField = SCOPE_FIELD[values.scope];

	return {
		name: values.name,
		description: values.description || undefined,
		scope: values.scope,
		...(scopeField ? { [scopeField]: values[scopeField] } : {}),
		valueType: values.valueType,
		value: values.value,
		code: values.code ? values.code.trim().toUpperCase() : undefined,
		startsAt: values.startsAt ? new Date(values.startsAt).toISOString() : undefined,
		endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : undefined,
		minPurchase: values.minPurchase > 0 ? values.minPurchase : undefined,
		usageLimit: values.usageLimit > 0 ? values.usageLimit : undefined,
		usageLimitPerUser:
			values.usageLimitPerUser > 0 ? values.usageLimitPerUser : undefined,
	};
};

/** ISO from the API to the `datetime-local` shape the input needs. */
export const toDateTimeLocal = (value?: string | null): string => {
	if (!value) return '';

	const date = new Date(value);
	const offset = date.getTimezoneOffset() * 60000;

	return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
