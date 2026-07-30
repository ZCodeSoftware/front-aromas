import { useCallback } from 'react';
import { Info } from 'lucide-react';
import { FunnelChart, Meter, ShareBar } from '@/components/charts';
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
import { scopeKindOf } from './utils/analytics-scope';
import { describeRange } from './utils/analytics-range';
import {
	formatCurrency,
	formatInteger,
	formatPercent,
} from './utils/format';

const AnalyticsConversion = ({ range }: IAnalyticsViewProps) => {
	const load = useCallback(
		() =>
			analyticsGetService.getConversion({
				dateFrom: range.dateFrom,
				dateTo: range.dateTo,
				timezone: range.timezone,
			}),
		[range.dateFrom, range.dateTo, range.timezone]
	);

	const conversion = useAnalyticsResource(load);

	if (conversion.status === 'loading') {
		return (
			<AnalyticsLoading tiles={3} label='Cargando la conversión…' />
		);
	}

	if (conversion.status === 'error' || !conversion.data) {
		return (
			<AnalyticsError
				message='No pudimos cargar las métricas de conversión.'
				onRetry={conversion.retry}
			/>
		);
	}

	const { carts, orders, lifetime } = conversion.data;
	const isStale = conversion.status === 'refreshing';

	return (
		<div className='flex flex-col gap-4'>
			{/*
			 * Said before any number is shown: the three blocks below measure
			 * three different windows, and the backend is explicit that no
			 * single period-scoped conversion rate is defensible in this
			 * schema. Presenting them as one funnel would invent a metric.
			 */}
			<p className='flex items-start gap-2 rounded-xl border border-aromas_gray_line bg-white p-4 text-sm text-aromas_ink_muted shadow-sm'>
				<Info
					aria-hidden='true'
					className='mt-0.5 size-4 shrink-0 text-aromas_fucsia_ink'
				/>
				<span>
					Cada bloque mide una ventana distinta, y la etiqueta de cada
					tarjeta lo aclara: los carritos son una foto de ahora, las
					órdenes corresponden al período elegido y la tasa de
					conversión es histórica. No hay una única tasa comparable
					entre las tres.
				</span>
			</p>

			<MetricCard
				title='Carritos'
				description={carts.note}
				scope={scopeKindOf(carts.scope)}>
				<div className='flex flex-col gap-5'>
					<StatTileGroup>
						<StatTile
							label='Carritos con items'
							value={formatInteger(carts.cartsWithItems)}
							scope='snapshot'
						/>
						<StatTile
							label='Carritos abandonados'
							value={formatInteger(carts.abandonedCarts)}
							hint={`Sin actividad por más de ${carts.abandonedAfterHours} h.`}
							scope='snapshot'
						/>
						<StatTile
							label='Valor abandonado'
							value={formatCurrency(
								carts.abandonedValueAtCartPrices
							)}
							hint='A los precios guardados en el carrito.'
							scope='snapshot'
						/>
					</StatTileGroup>

					<Meter
						label='Carritos abandonados sobre el total con items'
						value={carts.abandonedCarts}
						max={carts.cartsWithItems}
						valueText={`${formatInteger(
							carts.abandonedCarts
						)} de ${formatInteger(carts.cartsWithItems)} carritos`}
						status={
							carts.cartsWithItems > 0 &&
							carts.abandonedCarts / carts.cartsWithItems > 0.5
								? 'critical'
								: carts.abandonedCarts > 0
									? 'warning'
									: 'good'
						}
						hint='Si este número es alto, el problema está en el checkout, no en el catálogo.'
					/>
				</div>
			</MetricCard>

			{/*
			 * The total lives in the card description rather than in a tile of
			 * its own: a lone tile in a three-column row left two thirds of the
			 * card empty, and the number is already the sum of the two segments
			 * right below it.
			 */}
			<MetricCard
				title='Órdenes del período'
				description={`${formatInteger(
					orders.ordersInRange
				)} órdenes entre ${describeRange(range)}.`}
				scope={scopeKindOf(orders.scope)}>
				<div className='flex flex-col gap-5'>
					<ShareBar
						title='Órdenes por tipo de comprador'
						segments={[
							{
								key: 'customers',
								label: 'De clientes registrados',
								value: orders.customerOrdersInRange,
							},
							{
								key: 'anonymous',
								label: 'Anónimas',
								value: orders.anonymousOrdersInRange,
							},
						]}
						valueLabel='Órdenes'
						categoryLabel='Tipo de comprador'
						formatValue={formatInteger}
						summary={`De las ${formatInteger(
							orders.ordersInRange
						)} órdenes del período, ${formatInteger(
							orders.customerOrdersInRange
						)} son de clientes registrados y ${formatInteger(
							orders.anonymousOrdersInRange
						)} anónimas.`}
						emptyMessage='Todavía no hay órdenes en este período.'
						isStale={isStale}
					/>
				</div>
			</MetricCard>

			<MetricCard
				title='Del carrito a la venta'
				description={`Tasa histórica: ${formatPercent(
					lifetime.addToCartToSaleRate
				)}. ${lifetime.note}`}
				scope={scopeKindOf(lifetime.scope)}>
				<FunnelChart
						title='Embudo histórico: agregados al carrito y unidades vendidas'
						description='Contadores acumulados desde el inicio: no se filtran por período.'
						stages={[
							{
								key: 'addToCart',
								label: 'Agregados al carrito',
								value: lifetime.addToCartEvents,
							},
							{
								key: 'sold',
								label: 'Unidades vendidas',
								value: lifetime.soldUnits,
							},
						]}
						valueLabel='Eventos'
						formatValue={formatInteger}
						summary={`De ${formatInteger(
							lifetime.addToCartEvents
						)} agregados al carrito acumulados se vendieron ${formatInteger(
							lifetime.soldUnits
						)} unidades: una tasa de ${formatPercent(
							lifetime.addToCartToSaleRate
						)}.`}
					isStale={isStale}
				/>
			</MetricCard>
		</div>
	);
};

export default AnalyticsConversion;
