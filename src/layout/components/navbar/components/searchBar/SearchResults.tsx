import productImage from '../../../../../mocks/products/product-image/dd0ae5f22f356d984fc7741ecaf2df9dcda764a3.png';
import type { ISearchResultItemProps } from './models/search-result-props.interface';

export const SearchResults = ({ product }: ISearchResultItemProps) => {
	return (
		<a
			href='#'
			className='flex items-center space-x-4 p-2 hover:bg-aromas_nav_bg rounded-lg cursor-pointer'>
			<img
				src={productImage}
				alt={product.name}
				className='w-16 h-16 rounded-lg object-cover bg-white'
			/>
			<div>
				<p className='text-aromas_gray_text font-semibold'>
					{product.name}
				</p>
				<p className='text-aromas_fucsia font-medium'>
					${product.price.toFixed(2)}
				</p>
			</div>
		</a>
	);
};
