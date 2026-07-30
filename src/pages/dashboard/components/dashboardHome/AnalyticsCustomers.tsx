import { useCallback } from 'react';
import { RankedBarChart, ShareBar } from '@/components/charts';
import { analyticsGetService } from '@/services/analytics/GET/analytics.service.get';
import StatTile from './StatTile';
import MetricCard from './components/MetricCard';
import {
	AnalyticsError,
	AnalyticsLoading,
	StatTileGroup,
} from './components/AnalyticsStates';
import { useAnalyticsResource } from './hooks/useAnalyticsResource';
import type { IAnalyticsViewProps } from './models/analytics-view-props.interface';
import { describeRange } from './utils/analytics-range';
import {
	formatCurrency,
	formatInstantAsDay,
	formatInteger,
} from './utils/format';

const AnalyticsCustomers = ({ range }: IAnalyticsViewProps) => {
	const load = useCallback(
		() =>
			analyticsGetService.getCustomers({
				dateFrom: range.dateFrom,
				dateTo: range.dateTo,
				timezone: range.timezone,
			}),
		[range.dateFrom, range.dateTo, range.timezone]
	);

	const customers = useAnalyticsResource(load);

	if (customers.status === 'loading') {
		return <AnalyticsLoading tiles={4} label='Cargando los clientes…' />;
	}

	if (customers.status === 'error' || !customers.data) {
		return (
			<AnalyticsError
				message='No pudimos cargar las métricas de clientes.'
				onRetry={customers.retry}
			/>
		);
	}

	const { topCustomers, cohorts, anonymous } = customers.data;
	const isStale = customers.status === 'refreshing';

	const displayName = (customer: (typeof topCustomers)[number]): string =>
		[customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
		customer.email ||
		customer.userId;

	return (
		<div className='flex flex-col gap-4'>
			<StatTileGroup className='xl:grid-cols-4'>
				<StatTile
					label='Clientes nuevos'
					value={formatInteger(cohorts.newCustomers)}
					scope='range'
				/>
				<StatTile
					label='Clientes recurrentes'
					value={formatInteger(cohorts.returningCustomers)}
					scope='range'
				/>
				<StatTile
					label='Ingresos de nuevos'
					value={formatCurrency(cohorts.revenueFromNew)}
					scope='range'
				/>
				<StatTile
					label='Ingresos de recurrentes'
					value={formatCurrency(cohorts.revenueFromReturning)}
					scope='range'
				/>
			</StatTileGroup>

			<div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
				<MetricCard
					title='Órdenes: nuevos frente a recurrentes'
					description='Cuántas compras aporta cada cohorte.'
					scope='range'>
					<ShareBar
						title='Reparto de órdenes por cohorte'
						segments={[
							{
								key: 'new',
								label: 'Clientes nuevos',
								value: cohorts.ordersFromNew,
							},
							{
								key: 'returning',
								label: 'Clientes recurrentes',
								value: cohorts.ordersFromReturning,
							},
						]}
						valueLabel='Órdenes'
						categoryLabel='Cohorte'
						formatValue={formatInteger}
						summary={`Reparto de órdenes entre clientes nuevos y recurrentes entre ${describeRange(
							range
						)}.`}
						footnote={cohorts.definition}
						emptyMessage='Todavía no hay órdenes de clientes registrados en este período.'
						isStale={isStale}
					/>
				</MetricCard>

				<MetricCard
					title='Ingresos: nuevos frente a recurrentes'
					description='Cuánta facturación aporta cada cohorte.'
					scope='range'>
					<ShareBar
						title='Reparto de ingresos por cohorte'
						segments={[
							{
								key: 'new',
								label: 'Clientes nuevos',
								value: cohorts.revenueFromNew,
							},
							{
								key: 'returning',
								label: 'Clientes recurrentes',
								value: cohorts.revenueFromReturning,
							},
						]}
						valueLabel='Ingresos'
						categoryLabel='Cohorte'
						formatValue={formatCurrency}
						summary={`Reparto de ingresos entre clientes nuevos y recurrentes entre ${describeRange(
							range
						)}.`}
						emptyMessage='Todavía no hay ingresos de clientes registrados en este período.'
						isStale={isStale}
					/>
				</MetricCard>
			</div>

			<MetricCard
				title='Mejores clientes'
				description='Por facturación en el período. La tabla de datos incluye la fecha de la última compra.'
				scope='range'>
				<RankedBarChart
					title='Clientes por facturación'
					items={topCustomers.map((customer) => ({
						key: customer.userId,
						label: displayName(customer),
						value: customer.revenue,
						secondary: {
							label: 'Órdenes',
							value: `${formatInteger(
								customer.orders
							)} · última ${formatInstantAsDay(customer.lastOrderAt)}`,
						},
					}))}
					valueLabel='Ingresos'
					categoryLabel='Cliente'
					formatValue={formatCurrency}
					summary={`Ranking de clientes por facturación entre ${describeRange(
						range
					)}.`}
					emptyMessage='Todavía no hay compras de clientes registrados en este período.'
					isStale={isStale}
				/>
			</MetricCard>

			<MetricCard
				title='Ventas anónimas'
				description={anonymous.note}
				scope='range'>
				<StatTileGroup className='sm:grid-cols-2'>
					<StatTile
						label='Órdenes anónimas'
						value={formatInteger(anonymous.orders)}
						scope='range'
					/>
					<StatTile
						label='Ingresos anónimos'
						value={formatCurrency(anonymous.revenue)}
						hint='No entran en ninguna de las dos cohortes.'
						scope='range'
					/>
				</StatTileGroup>
			</MetricCard>
		</div>
	);
};

export default AnalyticsCustomers;
