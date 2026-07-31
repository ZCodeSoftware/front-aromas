import { useEffect } from 'react';
import ComboCard from '@/components/comboCard/ComboCard';
import ProductCard from '@/components/productCard/ProductCard';
import { pricingForCombo, pricingForProduct } from '@/lib/pricing';
import { usePromotionsStore } from '@/stores/promotions.store';
import type { IStoreCard } from './models/store-card.interface';

interface IProductsListProps {
	cards: IStoreCard[];
}

const ProductsList = ({ cards }: IProductsListProps) => {
	const promotions = usePromotionsStore((state) => state.promotions);
	const fetchActivePromotions = usePromotionsStore(
		(state) => state.fetchActivePromotions
	);

	useEffect(() => {
		fetchActivePromotions();
	}, [fetchActivePromotions]);

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-12'>
			{cards.map((card) =>
				card.kind === 'combo' ? (
					<ComboCard
						key={`combo:${card.data._id}`}
						combo={card.data}
						pricing={pricingForCombo(promotions, card.data)}
					/>
				) : (
					<ProductCard
						key={`product:${card.data._id}`}
						product={card.data}
						pricing={pricingForProduct(promotions, card.data)}
					/>
				)
			)}
		</div>
	);
};

export default ProductsList;
