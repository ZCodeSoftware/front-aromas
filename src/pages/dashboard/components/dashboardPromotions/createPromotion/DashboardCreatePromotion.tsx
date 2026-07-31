import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreatePromotion from './CreatePromotion';

const DashboardCreatePromotion = () => {
	const [view, setView] = useState('promotions');

	const renderView = () => {
		switch (view) {
			case 'promotions':
				return <CreatePromotion />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full'>
			<nav className='w-full flex justify-center border-b p-2'>
				<div className='flex items-center'>
					<Button
						variant={view === 'promotions' ? 'default' : 'ghost'}
						onClick={() => setView('promotions')}>
						Promociones
					</Button>
				</div>
			</nav>

			<div className='mt-4'>{renderView()}</div>
		</div>
	);
};

export default DashboardCreatePromotion;
