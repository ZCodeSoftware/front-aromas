import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { analyticsGetService } from '@/services/analytics/GET/analytics.service.get';
import type { IConversionReport } from '@/services/analytics/models/analytics.interface';
import StatTile from './StatTile';
import { formatCompactNumber, formatCurrency, formatPercent } from './utils/format';

const AnalyticsConversion = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<IConversionReport | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await analyticsGetService.getConversion();
			setData(result);
		} catch (error) {
			console.error('Error fetching conversion analytics:', error);
			toast.error('No se pudo cargar la conversión.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	if (loading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4'>
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} className='h-24 w-full rounded-xl' />
				))}
			</div>
		);
	}

	if (!data) {
		return (
			<div className='w-full p-8 text-center text-sm text-aromas_gray_text/70'>
				No se pudo cargar la conversión.
			</div>
		);
	}

	const { carts, orders, lifetime } = data;

	return (
		<div className='w-full flex flex-col gap-4 p-4'>
			<Card>
				<CardHeader>
					<CardTitle>Carritos (instantánea)</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
						<StatTile
							label='Carritos con items'
							value={formatCompactNumber(carts.cartsWithItems)}
						/>
						<StatTile
							label='Carritos abandonados'
							value={formatCompactNumber(carts.abandonedCarts)}
							hint={`Sin actividad ${carts.abandonedAfterHours}h`}
						/>
						<StatTile
							label='Valor abandonado'
							value={formatCurrency(carts.abandonedValueAtCartPrices)}
						/>
					</div>
					<span className='text-xs text-aromas_gray_text/70'>
						{carts.note}
					</span>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Órdenes en el rango</CardTitle>
				</CardHeader>
				<CardContent className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					<StatTile
						label='Órdenes'
						value={formatCompactNumber(orders.ordersInRange)}
					/>
					<StatTile
						label='De clientes'
						value={formatCompactNumber(orders.customerOrdersInRange)}
					/>
					<StatTile
						label='Anónimas'
						value={formatCompactNumber(orders.anonymousOrdersInRange)}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Histórico (agregar al carrito → venta)</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
						<StatTile
							label='Agregados al carrito'
							value={formatCompactNumber(lifetime.addToCartEvents)}
						/>
						<StatTile
							label='Unidades vendidas'
							value={formatCompactNumber(lifetime.soldUnits)}
						/>
						<StatTile
							label='Tasa de conversión'
							value={formatPercent(lifetime.addToCartToSaleRate)}
						/>
					</div>
					<span className='text-xs text-aromas_gray_text/70'>
						{lifetime.note}
					</span>
				</CardContent>
			</Card>
		</div>
	);
};

export default AnalyticsConversion;
