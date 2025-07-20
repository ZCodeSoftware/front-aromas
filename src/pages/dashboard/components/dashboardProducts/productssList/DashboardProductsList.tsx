import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductsList from './ProductsList';

const DashboardProducts = () => {
	const [view, setView] = useState('products');

	const renderView = () => {
		switch (view) {
			case 'products':
				return <ProductsList />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full'>
			<nav className='w-full flex justify-center border-b p-2'>
				<div className='flex items-center'>
					<Button
						variant={view === 'products' ? 'default' : 'ghost'}
						onClick={() => setView('products')}>
						Productos
					</Button>
				</div>
			</nav>
			<div className='p-4'>{renderView()}</div>
		</div>
	);
};

export default DashboardProducts;
