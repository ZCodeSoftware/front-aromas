import { useCallback } from 'react';
import { Meter, RankedBarChart } from '@/components/charts';
import { analyticsGetService } from '@/services/analytics/GET/analytics.service.get';
import StatTile from './StatTile';
import MetricCard from './components/MetricCard';
import SimpleTable from './components/SimpleTable';
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
	formatCurrencyCompact,
	formatInteger,
	formatUnits,
} from './utils/format';

const AnalyticsInventory = ({ range }: IAnalyticsViewProps) => {
	const load = useCallback(
		() =>
			analyticsGetService.getInventory({
				dateFrom: range.dateFrom,
				dateTo: range.dateTo,
				timezone: range.timezone,
			}),
		[range.dateFrom, range.dateTo, range.timezone]
	);

	const inventory = useAnalyticsResource(load);

	if (inventory.status === 'loading') {
		return (
			<AnalyticsLoading tiles={3} label='Cargando el estado del stock…' />
		);
	}

	if (inventory.status === 'error' || !inventory.data) {
		return (
			<AnalyticsError
				message='No pudimos cargar el estado del inventario.'
				onRetry={inventory.retry}
			/>
		);
	}

	const { summary, lowStock, outOfStock, deadStock } = inventory.data;
	const isStale = inventory.status === 'refreshing';

	/* Lowest stock first: the list is a work queue, not a leaderboard. */
	const lowStockQueue = [...lowStock].sort((a, b) => a.stock - b.stock);
	const deadStockByValue = [...deadStock.items]
		.map((item) => ({ ...item, capital: item.price * item.stock }))
		.sort((a, b) => b.capital - a.capital);

	/*
	 * Both lists are capped server-side while the counters cover the whole set,
	 * so a reader comparing "9 sin stock" against three rows needs telling.
	 */
	const partialListNote = (shown: number, total: number): string | undefined =>
		shown < total
			? `Se listan ${shown} de ${total}: la API acota el largo de la lista.`
			: undefined;

	return (
		<div className='flex flex-col gap-4'>
			<StatTileGroup>
				<StatTile
					label='Productos activos'
					value={formatInteger(summary.activeProducts)}
					scope='snapshot'
				/>
				<StatTile
					label='Unidades en stock'
					value={formatInteger(summary.unitsInStock)}
					scope='snapshot'
				/>
				<StatTile
					label='Valor a precio de venta'
					value={formatCurrency(summary.inventoryValueAtSalePrice)}
					hint='Valuado a precio de venta: los productos no tienen costo cargado.'
					scope='snapshot'
				/>
			</StatTileGroup>

			<MetricCard
				title='Salud del stock'
				description='Sobre los productos activos de este momento. No depende del período elegido.'
				scope='snapshot'>
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
					<Meter
						label='Sin stock'
						value={summary.outOfStockCount}
						max={summary.activeProducts}
						valueText={`${formatInteger(
							summary.outOfStockCount
						)} de ${formatInteger(summary.activeProducts)} productos`}
						status={summary.outOfStockCount > 0 ? 'critical' : 'good'}
						hint='No se pueden vender hasta reponer.'
					/>
					<Meter
						label='Stock bajo'
						value={summary.lowStockCount}
						max={summary.activeProducts}
						valueText={`${formatInteger(
							summary.lowStockCount
						)} de ${formatInteger(summary.activeProducts)} productos`}
						status={summary.lowStockCount > 0 ? 'warning' : 'good'}
						hint={`Umbral: ${summary.lowStockThreshold} unidades o menos.`}
					/>
				</div>
			</MetricCard>

			<div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
				<MetricCard
					title='Stock bajo'
					description='Ordenado de menor a mayor: lo primero de la lista es lo primero a reponer.'
					scope='snapshot'>
					<RankedBarChart
						title='Productos con stock bajo'
						items={lowStockQueue.map((item) => ({
							key: item._id,
							label: item.name,
							value: item.stock,
							secondary: {
								label: 'Precio',
								value: formatCurrency(item.price),
							},
						}))}
						valueLabel='Unidades'
						categoryLabel='Producto'
						formatValue={formatUnits}
						formatTick={formatInteger}
						summary={`Productos con ${summary.lowStockThreshold} unidades o menos, del más urgente al menos urgente.`}
						footnote={partialListNote(
							lowStock.length,
							summary.lowStockCount
						)}
						emptyMessage='Ningún producto está por debajo del umbral.'
						isStale={isStale}
					/>
				</MetricCard>

				<MetricCard
					title='Sin stock'
					description='Productos activos con cero unidades.'
					scope='snapshot'>
					{/*
					 * A bar chart of zeroes says nothing, so this stays a list:
					 * the question here is "which ones", not "how many units".
					 */}
					<div className='flex flex-col gap-2'>
						<SimpleTable
							caption='Productos activos sin stock, con su precio de venta'
							columns={['Producto', 'Precio']}
							rows={outOfStock.map((item) => [
								item.name,
								formatCurrency(item.price),
							])}
							emptyMessage='Ningún producto activo está sin stock.'
						/>
						{partialListNote(
							outOfStock.length,
							summary.outOfStockCount
						) && (
							<p className='text-xs text-aromas_ink_muted'>
								{partialListNote(
									outOfStock.length,
									summary.outOfStockCount
								)}
							</p>
						)}
					</div>
				</MetricCard>
			</div>

			<MetricCard
				title='Stock estancado'
				description={`${deadStock.definition} Es el único bloque de esta vista que sí usa el período (${describeRange(
					range
				)}).`}
				scope='range'>
				<div className='flex flex-col gap-4'>
					<StatTileGroup className='sm:grid-cols-2'>
						<StatTile
							label='Productos estancados'
							value={formatInteger(deadStock.count)}
							scope='range'
						/>
						<StatTile
							label='Capital inmovilizado'
							value={formatCurrency(deadStock.valueAtSalePrice)}
							hint='Sobre el conjunto completo, no sólo los que se listan.'
							scope='range'
						/>
					</StatTileGroup>

					{/*
					 * Plots the capital, not the units: the bars are sorted by
					 * what they tie up, so plotting units gave a "ranked" chart
					 * whose bars went 38, 4, 61, 22 and read as broken. The
					 * unit count rides along as the secondary measure.
					 */}
					<RankedBarChart
						title='Stock estancado por capital inmovilizado'
						items={deadStockByValue.map((item) => ({
							key: item._id,
							label: item.name,
							value: item.capital,
							secondary: {
								label: 'Unidades',
								value: formatUnits(item.stock),
							},
						}))}
						valueLabel='Valor a precio de venta'
						categoryLabel='Producto'
						formatValue={formatCurrency}
						formatTick={formatCurrencyCompact}
						summary={`Productos sin ventas en el período, ordenados por el capital que inmovilizan. En total ${formatCurrency(
							deadStock.valueAtSalePrice
						)}.`}
						footnote={partialListNote(
							deadStock.items.length,
							deadStock.count
						)}
						emptyMessage='Todos los productos con stock tuvieron ventas en el período.'
						isStale={isStale}
					/>
				</div>
			</MetricCard>
		</div>
	);
};

export default AnalyticsInventory;
