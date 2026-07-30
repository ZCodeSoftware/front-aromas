import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateCategory from './CreateCategory';
import CreateBrand from './CreateBrand';
import CreateAssociatedEmotion from './CreateAssociatedEmotion';
import CreateColor from './CreateColor';
import CreateEssence from './CreateEssence';
import CreateSubCategory from './CreateSubCategory';
import CreateTypeHousing from './CreateTypeHousing';
import CreatePaymentMethod from './CreatePaymentMethod';

const createViews = [
	{ id: 'categories', name: 'Categoría', component: <CreateCategory /> },
	{
		id: 'sub-category',
		name: 'Sub-Categoría',
		component: <CreateSubCategory />,
	},
	{ id: 'brand', name: 'Marca', component: <CreateBrand /> },
	{
		id: 'associatedEmotion',
		name: 'Emoción',
		component: <CreateAssociatedEmotion />,
	},
	{ id: 'color', name: 'Color', component: <CreateColor /> },
	{ id: 'essence', name: 'Esencia', component: <CreateEssence /> },
	{
		id: 'type-housing',
		name: 'Tipo de Vivienda',
		component: <CreateTypeHousing />,
	},
	{
		id: 'payment-method',
		name: 'Método de Pago',
		component: <CreatePaymentMethod />,
	},
];

const DashboardCreateCatalogs = () => {
	const [view, setView] = useState(createViews[0].id);

	const renderView = () =>
		createViews.find((createView) => createView.id === view)?.component ??
		null;

	return (
		<div>
			<nav className='w-full flex justify-center border-b p-2'>
				<div
					data-tutorial='create-catalog-tabs'
					className='flex flex-wrap justify-center items-center gap-2'>
					{createViews.map((createView) => (
						<Button
							key={createView.id}
							className={`text-aromas_fucsia border border-aromas_fucsia ${
								view === createView.id
									? 'bg-aromas_pink text-aromas_gray_text'
									: ''
							}`}
							onClick={() => setView(createView.id)}>
							{createView.name}
						</Button>
					))}
				</div>
			</nav>
			<div data-tutorial='create-catalog-form' className='p-4 mt-4'>
				{renderView()}
			</div>
		</div>
	);
};

export default DashboardCreateCatalogs;
