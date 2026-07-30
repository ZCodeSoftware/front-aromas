import { useCallback, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
	ColumnChart,
	LineAreaChart,
	RankedBarChart,
	ShareBar,
} from '@/components/charts';
import { analyticsGetService } from '@/services/analytics/GET/analytics.service.get';
import type { IGroupBy } from '@/services/analytics/models/analytics.interface';
import StatTile from './StatTile';
import MetricCard from './components/MetricCard';
import {
	AnalyticsError,
	AnalyticsLoading,
	StatTileGroup,
} from './components/AnalyticsStates';
import { useAnalyticsResource } from './hooks/useAnalyticsResource';
import type { IAnalyticsViewProps } from './models/analytics-view-props.interface';
import {
	ORDER_STATUS_LABELS,
	labelFor,
	percentChange,
	scopeKindOf,
} from './utils/analytics-scope';
import {
	describeRange,
	previousPeriod,
	suggestedGroupBy,
} from './utils/analytics-range';
import {
	formatBucketLabel,
	formatCompactNumber,
	formatCurrency,
	formatCurrencyCompact,
	formatInteger,
	formatUnits,
} from './utils/format';

const GROUP_BY_OPTIONS: { value: IGroupBy; label: string }[] = [
	{ value: 'day', label: 'Día' },
	{ value: 'week', label: 'Semana' },
	{ value: 'month', label: 'Mes' },
];

const COMPARISON_LABEL = 'vs. período anterior';

const AnalyticsOverview = ({ range }: IAnalyticsViewProps) => {
	/*
	 * Null means "follow the period": a 12-month window bucketed by day is 365
	 * columns nobody can read. An explicit choice wins and then sticks, because
	 * overriding a reader's own click on the next refilter is worse than a
	 * chart they have to re-coarsen.
	 */
	const [groupByOverride, setGroupByOverride] = useState<IGroupBy | null>(
		null
	);
	const groupBy = groupByOverride ?? suggestedGroupBy(range);
	const comparison = useMemo(() => previousPeriod(range), [range]);

	const loadDashboard = useCallback(
		() =>
			analyticsGetService.getDashboard({
				dateFrom: range.dateFrom,
				dateTo: range.dateTo,
				timezone: range.timezone,
			}),
		[range.dateFrom, range.dateTo, range.timezone]
	);

	const loadPrevious = useCallback(
		() =>
			analyticsGetService.getDashboard({
				dateFrom: comparison.dateFrom,
				dateTo: comparison.dateTo,
				timezone: comparison.timezone,
			}),
		[comparison.dateFrom, comparison.dateTo, comparison.timezone]
	);

	const loadTimeseries = useCallback(
		() =>
			analyticsGetService.getSalesTimeseries({
				dateFrom: range.dateFrom,
				dateTo: range.dateTo,
				timezone: range.timezone,
				groupBy,
			}),
		[range.dateFrom, range.dateTo, range.timezone, groupBy]
	);

	const dashboard = useAnalyticsResource(loadDashboard);
	const previous = useAnalyticsResource(loadPrevious);
	const timeseries = useAnalyticsResource(loadTimeseries);

	if (dashboard.status === 'loading') {
		return <AnalyticsLoading label='Cargando el resumen del negocio…' />;
	}

	if (dashboard.status === 'error' || !dashboard.data) {
		return (
			<AnalyticsError
				message='No pudimos cargar el resumen del negocio.'
				onRetry={dashboard.retry}
			/>
		);
	}

	const { sales, catalogue, engagement } = dashboard.data;
	const points = timeseries.data?.points ?? [];
	const isStale = dashboard.status === 'refreshing';
	const engagementScope = scopeKindOf(engagement.scope);

	/*
	 * Deltas are only shown once the comparison window has actually landed —
	 * a tile that renders "+0%" while its base is still in flight is a lie
	 * with a number in it.
	 */
	const deltaFor = (
		current: number,
		pick: (data: NonNullable<typeof previous.data>) => number
	) =>
		previous.status === 'ready' && previous.data
			? {
					percent: percentChange(current, pick(previous.data)),
					comparisonLabel: COMPARISON_LABEL,
				}
			: undefined;

	return (
		<div className='flex flex-col gap-4'>
			{/*
			 * The hero takes its own row and the five supporting figures share
			 * the next one: spanning the hero across a four-column grid left a
			 * hole at the end of the second row, which reads as a missing tile.
			 */}
			<StatTileGroup className='xl:grid-cols-5'>
				<StatTile
					isHero
					label='Ingresos'
					value={formatCurrency(sales.revenue)}
					hint='Toda orden no cancelada ni reembolsada, pendientes incluidas.'
					scope='range'
					trend={points.map((point) => point.revenue)}
					delta={deltaFor(sales.revenue, (data) => data.sales.revenue)}
				/>
				<StatTile
					label='Ingresos cobrados'
					value={formatCurrency(sales.paidRevenue)}
					hint='Dinero efectivamente tomado.'
					scope='range'
					trend={points.map((point) => point.paidRevenue)}
					delta={deltaFor(
						sales.paidRevenue,
						(data) => data.sales.paidRevenue
					)}
				/>
				<StatTile
					label='Órdenes'
					value={formatInteger(sales.totalOrders)}
					scope='range'
					trend={points.map((point) => point.orders)}
					delta={deltaFor(
						sales.totalOrders,
						(data) => data.sales.totalOrders
					)}
				/>
				<StatTile
					label='Órdenes pagadas'
					value={formatInteger(sales.paidOrders)}
					scope='range'
					trend={points.map((point) => point.paidOrders)}
					delta={deltaFor(
						sales.paidOrders,
						(data) => data.sales.paidOrders
					)}
				/>
				<StatTile
					label='Productos'
					value={formatInteger(catalogue.totalProducts)}
					scope='lifetime'
					hint='El catálogo no se filtra por período.'
				/>
				<StatTile
					label='Usuarios'
					value={formatInteger(catalogue.totalUsers)}
					scope='lifetime'
					hint='Los usuarios no se filtran por período.'
				/>
			</StatTileGroup>

			<MetricCard
				title='Ventas en el tiempo'
				description={`Ingresos por ${
					groupBy === 'day' ? 'día' : groupBy === 'week' ? 'semana' : 'mes'
				} entre ${describeRange(range)}.`}
				scope='range'
				action={
					<fieldset
						data-tutorial='home-groupby'
						className='flex flex-col gap-1'>
						<legend className='sr-only'>
							Agrupar el gráfico de ventas por
						</legend>
						<div className='flex flex-wrap gap-1.5'>
							{GROUP_BY_OPTIONS.map((option) => (
								<label key={option.value} className='cursor-pointer'>
									<input
										type='radio'
										name='overview-group-by'
										value={option.value}
										checked={groupBy === option.value}
										onChange={() =>
											setGroupByOverride(option.value)
										}
										className='peer sr-only'
									/>
									<span
										className={cn(
											'inline-flex min-h-[32px] items-center rounded-full border border-aromas_fucsia_ink px-3 py-1 text-xs font-medium text-aromas_fucsia_ink',
											'peer-hover:bg-aromas_fucsia_ink/10',
											'peer-checked:bg-aromas_pink peer-checked:text-aromas_gray_text',
											'peer-focus-visible:ring-2 peer-focus-visible:ring-aromas_fucsia_ink peer-focus-visible:ring-offset-2'
										)}>
										{option.label}
									</span>
								</label>
							))}
						</div>
					</fieldset>
				}>
				{timeseries.status === 'error' ? (
					<AnalyticsError
						message='No pudimos cargar la serie de ventas.'
						onRetry={timeseries.retry}
					/>
				) : (
					<ColumnChart
						title='Ingresos por período'
						description='Las columnas más claras son períodos que se extienden fuera del rango elegido.'
						points={points.map((point) => ({
							key: point.bucket,
							label: formatBucketLabel(point.bucket, groupBy),
							value: point.revenue,
							isPartial: point.partial,
							detail: [
								{
									label: 'Órdenes',
									value: formatInteger(point.orders),
								},
								{
									label: 'Cobrado',
									value: formatCurrency(point.paidRevenue),
								},
							],
						}))}
						valueLabel='Ingresos'
						categoryLabel='Período'
						formatValue={formatCurrency}
						formatTick={formatCurrencyCompact}
						summary={`Ingresos por período entre ${describeRange(range)}. ${
							points.length
						} períodos, con un total de ${formatCurrency(
							timeseries.data?.totals.revenue ?? 0
						)}.`}
						isStale={timeseries.status === 'refreshing'}
					/>
				)}
			</MetricCard>

			<MetricCard
				title='Ticket promedio'
				description='Cuánto deja cada orden. Dos medidas de la misma escala, en un solo eje.'
				scope='range'>
				<LineAreaChart
					title='Ticket promedio por período'
					labels={points.map((point) =>
						formatBucketLabel(point.bucket, groupBy)
					)}
					series={[
						{
							key: 'avgTicket',
							name: 'Todas las órdenes',
							values: points.map((point) => point.avgTicket),
						},
						{
							key: 'paidAvgTicket',
							name: 'Sólo cobradas',
							values: points.map((point) => point.paidAvgTicket),
						},
					]}
					categoryLabel='Período'
					formatValue={formatCurrency}
					formatTick={formatCurrencyCompact}
					summary={`Ticket promedio por período entre ${describeRange(
						range
					)}. Promedio del período: ${formatCurrency(
						timeseries.data?.totals.avgTicket ?? 0
					)}.`}
					isStale={timeseries.status === 'refreshing'}
				/>
			</MetricCard>

			<div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
				<MetricCard
					title='Órdenes por estado'
					description='Cómo se reparten las órdenes del período.'
					scope='range'>
					<ShareBar
						title='Reparto de órdenes por estado'
						segments={sales.ordersByStatus.map((row) => ({
							key: row.status,
							label: labelFor(ORDER_STATUS_LABELS, row.status),
							value: row.count,
						}))}
						valueLabel='Órdenes'
						categoryLabel='Estado'
						formatValue={formatInteger}
						summary={`Reparto de las ${formatInteger(
							sales.totalOrders
						)} órdenes del período por estado.`}
						emptyMessage='Todavía no hay órdenes en este período.'
						isStale={isStale}
					/>
				</MetricCard>

				<MetricCard
					title='Más vendidos'
					description='Unidades despachadas en el período.'
					scope='range'>
					<RankedBarChart
						title='Productos más vendidos'
						items={sales.topSold.map((item) => ({
							key: item.product._id,
							label: item.name,
							value: item.quantity,
							secondary: {
								label: 'Ingresos',
								value: formatCurrency(item.revenue),
							},
						}))}
						valueLabel='Unidades'
						categoryLabel='Producto'
						formatValue={formatUnits}
						formatTick={formatInteger}
						summary={`Ranking de productos por unidades vendidas entre ${describeRange(
							range
						)}.`}
						emptyMessage='Todavía no se vendió nada en este período.'
						isStale={isStale}
					/>
				</MetricCard>

				<MetricCard
					title='Más vistos'
					description='Contadores acumulados por producto. No se filtran por período.'
					scope={engagementScope}>
					<RankedBarChart
						title='Productos más vistos'
						items={engagement.topViewed.map((item) => ({
							key: item.product._id,
							label: item.product.name ?? item.product._id,
							value: item.value,
						}))}
						valueLabel='Vistas'
						categoryLabel='Producto'
						formatValue={formatInteger}
						formatTick={formatCompactNumber}
						summary='Ranking histórico de productos por cantidad de vistas.'
						emptyMessage='Todavía no hay vistas registradas.'
						isStale={isStale}
					/>
				</MetricCard>

				<MetricCard
					title='Más agregados al carrito'
					description='Contadores acumulados por producto. No se filtran por período.'
					scope={engagementScope}>
					<RankedBarChart
						title='Productos más agregados al carrito'
						items={engagement.topAddedToCart.map((item) => ({
							key: item.product._id,
							label: item.product.name ?? item.product._id,
							value: item.value,
						}))}
						valueLabel='Agregados'
						categoryLabel='Producto'
						formatValue={formatInteger}
						formatTick={formatCompactNumber}
						summary='Ranking histórico de productos por veces agregado al carrito.'
						emptyMessage='Todavía no hay carritos registrados.'
						isStale={isStale}
					/>
				</MetricCard>
			</div>
		</div>
	);
};

export default AnalyticsOverview;
