import { useEffect, useState } from 'react';
import type { IProduct } from '@/services/products/models/products.interface';
import ProductCard from '../../../components/productCard/ProductCard';
import { productService } from '@/services/products/GET/products.service.get';

const ProductsList = () => {
	const [products, setProducts] = useState<IProduct[]>([]);

	const fetchProducts = async () => {
		try {
			const response = await productService.getProducts();
			setProducts(response);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div className='max-w-7xl mx-auto px-6'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
				{products.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default ProductsList;
