import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateCombo from './CreateCombo';

const DashboardCreateCombo = () => {
	const [view, setView] = useState('combos');

	const renderView = () => {
		switch (view) {
			case 'combos':
				return <CreateCombo />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full'>
			<nav className='w-full flex justify-center border-b p-2'>
				<div className='flex items-center'>
					<Button
						variant={view === 'combos' ? 'default' : 'ghost'}
						onClick={() => setView('combos')}>
						Combos
					</Button>
				</div>
			</nav>

			<div className='mt-4'>{renderView()}</div>
		</div>
	);
};

export default DashboardCreateCombo;
