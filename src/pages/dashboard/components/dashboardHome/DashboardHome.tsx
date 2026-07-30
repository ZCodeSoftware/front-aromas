import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChartTextureDefs } from '@/components/charts';
import AnalyticsOverview from './AnalyticsOverview';
import AnalyticsInventory from './AnalyticsInventory';
import AnalyticsCustomers from './AnalyticsCustomers';
import AnalyticsConversion from './AnalyticsConversion';
import AnalyticsSalesBreakdown from './AnalyticsSalesBreakdown';
import RangeFilter from './components/RangeFilter';
import {
	DEFAULT_RANGE,
	type IAnalyticsRange,
} from './utils/analytics-range';

type IAnalyticsView =
	| 'overview'
	| 'breakdown'
	| 'inventory'
	| 'customers'
	| 'conversion';

interface IViewDefinition {
	id: IAnalyticsView;
	label: string;
	/** Sentence under the tab strip: what this view answers. */
	summary: string;
	tutorialId: string;
}

const VIEWS: IViewDefinition[] = [
	{
		id: 'overview',
		label: 'Resumen',
		summary: 'Ingresos, órdenes y los productos que más se mueven.',
		tutorialId: 'home-view-overview',
	},
	{
		id: 'breakdown',
		label: 'Canales',
		summary:
			'De dónde viene la facturación: tienda online, mostrador y método de pago.',
		tutorialId: 'home-view-breakdown',
	},
	{
		id: 'inventory',
		label: 'Inventario',
		summary: 'Qué reponer primero y cuánto capital está inmovilizado.',
		tutorialId: 'home-view-inventory',
	},
	{
		id: 'customers',
		label: 'Clientes',
		summary: 'Cuánto pesan los clientes nuevos frente a los que vuelven.',
		tutorialId: 'home-view-customers',
	},
	{
		id: 'conversion',
		label: 'Conversión',
		summary: 'Dónde se pierden las ventas entre el carrito y la compra.',
		tutorialId: 'home-view-conversion',
	},
];

/**
 * The metrics section.
 *
 * The five views are a real tab set — `tablist`/`tab`/`tabpanel` with a roving
 * tabindex — rather than five buttons that happen to swap a `div`. That means
 * one stop in the tab order for the whole strip, arrow keys between views, and
 * a screen reader that says "Canales, tab 2 of 5, selected" instead of reading
 * five unrelated buttons with no hint that they are alternatives.
 *
 * The period filter sits above the strip and scopes every view, so switching
 * tabs never silently changes the window the numbers describe.
 */
const DashboardHome = () => {
	const [view, setView] = useState<IAnalyticsView>('overview');
	const [range, setRange] = useState<IAnalyticsRange>(DEFAULT_RANGE);
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const activeIndex = VIEWS.findIndex((item) => item.id === view);
	const active = VIEWS[activeIndex] ?? VIEWS[0];

	const focusTab = useCallback((index: number) => {
		const target = VIEWS[(index + VIEWS.length) % VIEWS.length];
		setView(target.id);
		tabRefs.current[target.id]?.focus();
	}, []);

	const onTabKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowRight':
				event.preventDefault();
				focusTab(activeIndex + 1);
				break;
			case 'ArrowLeft':
				event.preventDefault();
				focusTab(activeIndex - 1);
				break;
			case 'Home':
				event.preventDefault();
				focusTab(0);
				break;
			case 'End':
				event.preventDefault();
				focusTab(VIEWS.length - 1);
				break;
			default:
				break;
		}
	};

	const renderView = () => {
		switch (view) {
			case 'overview':
				return <AnalyticsOverview range={range} />;
			case 'breakdown':
				return <AnalyticsSalesBreakdown range={range} />;
			case 'inventory':
				return <AnalyticsInventory range={range} />;
			case 'customers':
				return <AnalyticsCustomers range={range} />;
			case 'conversion':
				return <AnalyticsConversion range={range} />;
			default:
				return null;
		}
	};

	return (
		<section aria-labelledby='dashboard-metrics-heading' className='w-full'>
			<ChartTextureDefs />

			<h2
				id='dashboard-metrics-heading'
				className='sr-only'>
				Métricas del negocio
			</h2>

			<div className='flex flex-col gap-4'>
				<RangeFilter value={range} onChange={setRange} />

				<div className='rounded-xl border border-aromas_gray_line bg-white p-2 shadow-sm'>
					<div
						data-tutorial='home-views'
						role='tablist'
						aria-label='Vistas de métricas'
						onKeyDown={onTabKeyDown}
						className='flex flex-wrap items-center gap-2'>
						{VIEWS.map((item) => {
							const isActive = item.id === view;
							return (
								<button
									key={item.id}
									ref={(node) => {
										tabRefs.current[item.id] = node;
									}}
									data-tutorial={item.tutorialId}
									type='button'
									role='tab'
									id={`metrics-tab-${item.id}`}
									aria-selected={isActive}
									aria-controls={`metrics-panel-${item.id}`}
									tabIndex={isActive ? 0 : -1}
									onClick={() => setView(item.id)}
									className={cn(
										'min-h-[40px] rounded-full border border-aromas_fucsia_ink px-4 py-2 text-sm font-medium transition-colors',
										'outline-none focus-visible:ring-2 focus-visible:ring-aromas_fucsia_ink focus-visible:ring-offset-2',
										isActive
											? 'bg-aromas_pink text-aromas_gray_text'
											: 'bg-white text-aromas_fucsia_ink hover:bg-aromas_fucsia_ink/10'
									)}>
									{item.label}
								</button>
							);
						})}
					</div>
					<p className='px-2 pb-1 pt-2 text-xs text-aromas_ink_muted'>
						{active.summary}
					</p>
				</div>

				{/*
				 * Not focusable: a tabpanel only needs its own tab stop when it
				 * holds nothing focusable, and every one of these holds charts
				 * and table toggles. Adding one would put an empty stop between
				 * the strip and the first control.
				 */}
				<div
					id={`metrics-panel-${active.id}`}
					role='tabpanel'
					aria-labelledby={`metrics-tab-${active.id}`}>
					{renderView()}
				</div>
			</div>
		</section>
	);
};

export default DashboardHome;
