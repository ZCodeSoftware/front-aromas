import ProductCard from '../../../../components/productCard/ProductCard';
import type { IProductListProps } from './models/product-list.interface';

const ProductsList = ({ products }: IProductListProps) => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-16 gap-y-12'>
			{products.map((product) => (
				<ProductCard key={product._id} product={product} />
			))}
		</div>
	);
};

export default ProductsList;
