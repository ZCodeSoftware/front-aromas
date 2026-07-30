import type { IProductForm } from '../../createProduct/models/product-form.interface';

type ProductFormErrors = {
	name: string;
	description: string;
	price: string;
	stock: string;
	category: string;
};

export const validateProductForm = (
	values: IProductForm
): ProductFormErrors => {
	const errors: ProductFormErrors = {
		name: '',
		description: '',
		price: '',
		stock: '',
		category: '',
	};

	if (!values.name) {
		errors.name = 'El nombre es requerido.';
	} else if (values.name.length < 3 || values.name.length >= 100) {
		errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
	}

	if (
		values.description &&
		(values.description.length < 10 || values.description.length >= 500)
	) {
		errors.description =
			'La descripción debe tener entre 10 y 500 caracteres.';
	}

	if (!values.price || values.price <= 0) {
		errors.price = 'El precio es requerido y debe ser mayor a 0.';
	}

	if (
		!values.stock ||
		values.stock === null ||
		values.stock === undefined ||
		values.stock <= 0
	) {
		errors.stock = 'El stock es requerido y no puede ser negativo.';
	}

	if (!values.category || values.category === 'null') {
		errors.category = 'La categoría es requerida.';
	}

	return errors;
};
