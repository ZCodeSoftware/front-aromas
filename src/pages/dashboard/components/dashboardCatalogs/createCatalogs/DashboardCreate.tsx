import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateCategory from './CreateCategory';
import CreateBrand from './CreateBrand';
import CreateAssociatedEmotion from './CreateAssociatedEmotion';
import CreateColor from './CreateColor';
import CreateEssence from './CreateEssence';
import CreateSubCategory from './CreateSubCategory';

const DashboardCreateCatalogs = () => {
	const [view, setView] = useState('categories');

	const renderView = () => {
		switch (view) {
			case 'categories':
				return <CreateCategory />;
			case 'brand':
				return <CreateBrand />;
			case 'associatedEmotion':
				return <CreateAssociatedEmotion />;
			case 'color':
				return <CreateColor />;
			case 'essence':
				return <CreateEssence />;
			case 'sub-category':
				return <CreateSubCategory />;
			default:
				return null;
		}
	};

	return (
		<div>
			<nav className='w-full flex justify-center border-b p-2'>
				<div className='flex items-center gap-2'>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'categories'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('categories')}>
						Categoría
					</Button>

					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'sub-category'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('sub-category')}>
						Sub-Categoría
					</Button>

					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'brand'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('brand')}>
						Marca
					</Button>

					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'associatedEmotion'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('associatedEmotion')}>
						Emoción
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'color'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('color')}>
						Color
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'essence'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('essence')}>
						Esencia
					</Button>
				</div>
			</nav>
			<div className='p-4 mt-4'>{renderView()}</div>
		</div>
	);
};

export default DashboardCreateCatalogs;
