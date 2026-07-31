import type {
	IComboForm,
	IComboFormErrors,
} from '../createCombo/models/combo-form.interface';

/**
 * Mirrors the backend rules on purpose: the length limits match CreateComboDTO
 * and the price-mode pairing matches ComboModel, so the form fails fast instead
 * of letting the API be the first to say no.
 */
export const validateComboForm = (values: IComboForm): IComboFormErrors => {
	const errors: IComboFormErrors = {
		name: '',
		description: '',
		items: '',
		price: '',
	};

	if (!values.name) {
		errors.name = 'El nombre es requerido.';
	} else if (values.name.length < 3 || values.name.length >= 100) {
		errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
	}

	if (values.description && values.description.length >= 500) {
		errors.description = 'La descripción no puede superar los 500 caracteres.';
	}

	if (!values.items.length) {
		errors.items = 'Agregá al menos un producto al combo.';
	} else if (values.items.some((item) => item.quantity < 1)) {
		errors.items = 'La cantidad de cada producto debe ser al menos 1.';
	}

	if (values.priceMode === 'FIXED') {
		if (!values.fixedPrice || values.fixedPrice <= 0) {
			errors.price = 'El precio del combo es requerido y debe ser mayor a 0.';
		}
	} else if (
		values.discountPercentage <= 0 ||
		values.discountPercentage > 100
	) {
		errors.price = 'El descuento debe estar entre 1 y 100.';
	}

	return errors;
};

/** Sum of the components at their current catalogue price. */
export const getCompareAtPrice = (items: IComboForm['items']): number =>
	items.reduce((total, item) => total + item.product.price * item.quantity, 0);

/** What the combo will cost, applying the same rule the backend applies. */
export const getComboPrice = (values: IComboForm): number => {
	if (values.priceMode === 'FIXED') return values.fixedPrice || 0;

	return (
		(getCompareAtPrice(values.items) * (100 - (values.discountPercentage || 0))) /
		100
	);
};

/**
 * How many combos can be assembled: the scarcest component decides. Same rule as
 * ComboModel on the backend, which is the authority — this is only a preview so
 * the admin does not publish a combo with no stock behind it.
 */
export const getDerivedStock = (items: IComboForm['items']): number => {
	if (!items.length) return 0;

	return items.reduce((available, item) => {
		if (!item.product.isActive || item.quantity < 1) return 0;

		return Math.min(available, Math.floor(item.product.stock / item.quantity));
	}, Number.POSITIVE_INFINITY);
};
