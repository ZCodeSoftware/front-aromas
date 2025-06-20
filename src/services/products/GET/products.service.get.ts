import type { IProduct } from '../models/products.interface';
import mockProducts from '../../../mocks/products/product-mock';

const getProducts = async (): Promise<IProduct[]> => {
	try {
		// const response = await axios.get<Product[]>(`URL`);
		// return response.data;

		// Para el mock
		return Promise.resolve(mockProducts);
	} catch (error) {
		console.error('Error fetching products:', error);
		throw error;
	}
};

export const productService = {
	getProducts,
};
