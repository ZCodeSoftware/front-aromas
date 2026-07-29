import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AnalyticsOverview from './AnalyticsOverview';
import AnalyticsInventory from './AnalyticsInventory';
import AnalyticsCustomers from './AnalyticsCustomers';
import AnalyticsConversion from './AnalyticsConversion';
import AnalyticsSalesBreakdown from './AnalyticsSalesBreakdown';

type IAnalyticsView =
	| 'overview'
	| 'inventory'
	| 'customers'
	| 'conversion'
	| 'breakdown';

const DashboardHome = () => {
	const [view, setView] = useState<IAnalyticsView>('overview');

	const renderView = () => {
		switch (view) {
			case 'overview':
				return <AnalyticsOverview />;
			case 'inventory':
				return <AnalyticsInventory />;
			case 'customers':
				return <AnalyticsCustomers />;
			case 'conversion':
				return <AnalyticsConversion />;
			case 'breakdown':
				return <AnalyticsSalesBreakdown />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full'>
			<div className='w-full flex justify-center border-b p-2'>
				<div className='flex items-center gap-2 flex-wrap'>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'overview'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('overview')}>
						Resumen
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'breakdown'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('breakdown')}>
						Canales
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'inventory'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('inventory')}>
						Inventario
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'customers'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('customers')}>
						Clientes
					</Button>
					<Button
						className={`text-aromas_fucsia border border-aromas_fucsia ${
							view === 'conversion'
								? 'bg-aromas_pink text-aromas_gray_text'
								: ''
						}`}
						onClick={() => setView('conversion')}>
						Conversión
					</Button>
				</div>
			</div>
			<div>{renderView()}</div>
		</div>
	);
};

export default DashboardHome;
