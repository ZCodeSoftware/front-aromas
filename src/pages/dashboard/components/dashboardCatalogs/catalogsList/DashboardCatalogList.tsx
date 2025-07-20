import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CategoriesList from './CategoriesList';
import SubCategoriesList from './SubCategoriesList';
import BrandsList from './BrandsList';
import AssociatedEmotionsList from './AssociatedEmotionsList';
import EssencesList from './EssencesList';
import ColorsList from './ColorsList';

const DashboardCatalogsList = () => {
	const [view, setView] = useState('categories');

	const renderView = () => {
		switch (view) {
			case 'categories':
				return <CategoriesList />;
			case 'sub-categories':
				return <SubCategoriesList />;
			case 'brands':
				return <BrandsList />;
			case 'associatedEmotions':
				return <AssociatedEmotionsList />;
			case 'colors':
				return <ColorsList />;
			case 'essences':
				return <EssencesList />;
			default:
				return null;
		}
	};

	return (
		<div>
			<div className='w-full flex justify-center border-b p-2'>
				<div className='flex items-center gap-2'>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'categories'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('categories')}>
						Categorías
					</Button>

					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'sub-categories'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('sub-categories')}>
						Sub-Categorías
					</Button>

					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'brands'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('brands')}>
						Marcas
					</Button>

					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'associatedEmotions'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('associatedEmotions')}>
						Emociones
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'colors'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('colors')}>
						Colores
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'essences'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('essences')}>
						Esencias
					</Button>
				</div>
			</div>
			<div className='p-4'>{renderView()}</div>
		</div>
	);
};

export default DashboardCatalogsList;
