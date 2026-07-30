import { useCallback } from 'react';
import { HeatmapChart, ShareBar } from '@/components/charts';
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
import { CHANNEL_LABELS, labelFor } from './utils/analytics-scope';
import { describeRange } from './utils/analytics-range';
import {
	formatCurrency,
	formatCurrencyCompact,
	formatInteger,
} from './utils/format';

const AnalyticsSalesBreakdown = ({ range }: IAnalyticsViewProps) => {
	const load = useCallback(
		() =>
			analyticsGetService.getSalesBreakdown({
				dateFrom: range.dateFrom,
				dateTo: range.dateTo,
				timezone: range.timezone,
			}),
		[range.dateFrom, range.dateTo, range.timezone]
	);

	const breakdown = useAnalyticsResource(load);

	if (breakdown.status === 'loading') {
		return (
			<AnalyticsLoading
				tiles={4}
				label='Cargando la distribución de ventas…'
			/>
		);
	}

	if (breakdown.status === 'error' || !breakdown.data) {
		return (
			<AnalyticsError
				message='No pudimos cargar la distribución de ventas.'
				onRetry={breakdown.retry}
			/>
		);
	}

	const { totals, byChannel, byPaymentMethod, matrix } = breakdown.data;
	const isStale = breakdown.status === 'refreshing';

	/*
	 * The matrix arrives as a flat list of populated cells. Pivoting it against
	 * the two marginals keeps a combination that never happened visible as an
	 * explicit "sin datos" instead of silently missing from the grid.
	 */
	const channels = byChannel.map((row) => row.channel);
	const methods = byPaymentMethod.map((row) => row.name);
	const matrixValues = channels.map((channel) =>
		methods.map((method) => {
			const cell = matrix.find(
				(one) => one.channel === channel && one.name === method
			);
			return cell ? cell.revenue : null;
		})
	);

	return (
		<div className='flex flex-col gap-4'>
			<StatTileGroup className='xl:grid-cols-4'>
				<StatTile
					label='Órdenes'
					value={formatInteger(totals.orders)}
					scope='range'
				/>
				<StatTile
					label='Ingresos'
					value={formatCurrency(totals.revenue)}
					scope='range'
				/>
				<StatTile
					label='Órdenes pagadas'
					value={formatInteger(totals.paidOrders)}
					scope='range'
				/>
				<StatTile
					label='Ingresos cobrados'
					value={formatCurrency(totals.paidRevenue)}
					scope='range'
				/>
			</StatTileGroup>

			<div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
				<MetricCard
					title='Por canal'
					description='Cuánto pesa el mostrador frente a la tienda online.'
					scope='range'>
					<ShareBar
						title='Ingresos por canal'
						segments={byChannel.map((row) => ({
							key: row.channel,
							label: labelFor(CHANNEL_LABELS, row.channel),
							value: row.revenue,
						}))}
						valueLabel='Ingresos'
						categoryLabel='Canal'
						formatValue={formatCurrency}
						summary={`Reparto de ${formatCurrency(
							totals.revenue
						)} de ingresos por canal entre ${describeRange(range)}.`}
						footnote='Las órdenes anteriores al campo "canal" cuentan como tienda online. Las ventas de mostrador no tienen costo de envío.'
						emptyMessage='Todavía no hay ventas en este período.'
						isStale={isStale}
					/>
				</MetricCard>

				<MetricCard
					title='Por método de pago'
					description='Con qué paga la gente.'
					scope='range'>
					<ShareBar
						title='Ingresos por método de pago'
						segments={byPaymentMethod.map((row) => ({
							key: row.paymentMethodId ?? row.name,
							label: row.name,
							value: row.revenue,
						}))}
						valueLabel='Ingresos'
						categoryLabel='Método'
						formatValue={formatCurrency}
						summary={`Reparto de ${formatCurrency(
							totals.revenue
						)} de ingresos por método de pago entre ${describeRange(
							range
						)}.`}
						emptyMessage='Todavía no hay pagos en este período.'
						isStale={isStale}
					/>
				</MetricCard>
			</div>

			<MetricCard
				title='Canal por método de pago'
				description='La grilla que hace falta para cerrar la caja: cada cruce con sus ingresos.'
				scope='range'>
				<HeatmapChart
					title='Ingresos por canal y método de pago'
					rowHeader='Canal'
					rowLabels={channels.map((channel) =>
						labelFor(CHANNEL_LABELS, channel)
					)}
					columnLabels={methods}
					values={matrixValues}
					formatValue={formatCurrency}
					formatCell={formatCurrencyCompact}
					summary={`Ingresos por cada cruce de canal y método de pago entre ${describeRange(
						range
					)}. Cada celda muestra su valor; el color sólo refuerza la magnitud.`}
					footnote='Los porcentajes redondeados pueden sumar 99,99 % o 100,01 % en lugar de 100 %.'
					emptyMessage='Todavía no hay cruces con ventas en este período.'
					isStale={isStale}
				/>
			</MetricCard>
		</div>
	);
};

export default AnalyticsSalesBreakdown;
