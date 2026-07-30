import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CategoriesList from './CategoriesList';
import SubCategoriesList from './SubCategoriesList';
import BrandsList from './BrandsList';
import AssociatedEmotionsList from './AssociatedEmotionsList';
import EssencesList from './EssencesList';
import ColorsList from './ColorsList';
import TypeHousingsList from './TypeHousingsList';
import PaymentMethodsList from './PaymentMethodsList';

const catalogViews = [
	{ id: 'categories', name: 'Categorías', component: <CategoriesList /> },
	{
		id: 'sub-categories',
		name: 'Sub-Categorías',
		component: <SubCategoriesList />,
	},
	{ id: 'brands', name: 'Marcas', component: <BrandsList /> },
	{
		id: 'associatedEmotions',
		name: 'Emociones',
		component: <AssociatedEmotionsList />,
	},
	{ id: 'colors', name: 'Colores', component: <ColorsList /> },
	{ id: 'essences', name: 'Esencias', component: <EssencesList /> },
	{
		id: 'type-housings',
		name: 'Tipos de Vivienda',
		component: <TypeHousingsList />,
	},
	{
		id: 'payment-methods',
		name: 'Métodos de Pago',
		component: <PaymentMethodsList />,
	},
];

const DashboardCatalogsList = () => {
	const [view, setView] = useState(catalogViews[0].id);

	const renderView = () =>
		catalogViews.find((catalogView) => catalogView.id === view)?.component ??
		null;

	return (
		<div>
			<div className='w-full flex justify-center border-b p-2'>
				<div
					data-tutorial='catalog-tabs'
					className='flex flex-wrap justify-center items-center gap-2'>
					{catalogViews.map((catalogView) => (
						<Button
							key={catalogView.id}
							className={`text-aromas_fucsia border border-aromas_fucsia ${
								view === catalogView.id
									? 'bg-aromas_pink text-aromas_gray_text'
									: ''
							}`}
							onClick={() => setView(catalogView.id)}>
							{catalogView.name}
						</Button>
					))}
				</div>
			</div>
			<div data-tutorial='catalogs-table' className='p-4'>
				{renderView()}
			</div>
		</div>
	);
};

export default DashboardCatalogsList;
