import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { analyticsGetService } from '@/services/analytics/GET/analytics.service.get';
import type {
	IDashboard,
	IGroupBy,
	ISalesTimeSeries,
} from '@/services/analytics/models/analytics.interface';
import StatTile from './StatTile';
import SalesTimeseriesChart from './SalesTimeseriesChart';
import { formatCompactNumber, formatCurrency } from './utils/format';

const GROUP_BY_OPTIONS: { value: IGroupBy; label: string }[] = [
	{ value: 'day', label: 'Día' },
	{ value: 'week', label: 'Semana' },
	{ value: 'month', label: 'Mes' },
];

const ORDER_STATUS_LABELS: Record<string, string> = {
	PENDING: 'Pendiente',
	PAID: 'Pagado',
	SHIPPED: 'Enviado',
	DELIVERED: 'Entregado',
	CANCELLED: 'Cancelado',
	REFUNDED: 'Reembolsado',
};

const AnalyticsOverview = () => {
	const [loading, setLoading] = useState(true);
	const [dashboard, setDashboard] = useState<IDashboard | null>(null);
	const [timeseries, setTimeseries] = useState<ISalesTimeSeries | null>(null);
	const [timeseriesLoading, setTimeseriesLoading] = useState(true);
	const [groupBy, setGroupBy] = useState<IGroupBy>('day');

	const getDashboard = async () => {
		setLoading(true);
		try {
			const result = await analyticsGetService.getDashboard();
			setDashboard(result);
		} catch (error) {
			console.error('Error fetching analytics dashboard:', error);
			toast.error('No se pudieron cargar las métricas del panel.');
		} finally {
			setLoading(false);
		}
	};

	const getTimeseries = async (nextGroupBy: IGroupBy) => {
		setTimeseriesLoading(true);
		try {
			const result = await analyticsGetService.getSalesTimeseries({
				groupBy: nextGroupBy,
			});
			setTimeseries(result);
		} catch (error) {
			console.error('Error fetching sales timeseries:', error);
			toast.error('No se pudo cargar la serie de ventas.');
		} finally {
			setTimeseriesLoading(false);
		}
	};

	useEffect(() => {
		getDashboard();
	}, []);

	useEffect(() => {
		getTimeseries(groupBy);
	}, [groupBy]);

	if (loading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4'>
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} className='h-24 w-full rounded-xl' />
				))}
			</div>
		);
	}

	if (!dashboard) {
		return (
			<div className='w-full p-8 text-center text-sm text-aromas_gray_text/70'>
				No se pudieron cargar las métricas del panel.
			</div>
		);
	}

	const { sales, catalogue, engagement, range } = dashboard;

	return (
		<div className='w-full flex flex-col gap-4 p-4'>
			<span className='text-xs text-aromas_gray_text/70'>
				{range
					? `Rango: ${range.dateFrom} a ${range.dateTo} (${range.timezone})`
					: 'Histórico completo'}
			</span>

			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
				<StatTile
					label='Ingresos'
					value={formatCurrency(sales.revenue)}
				/>
				<StatTile
					label='Ingresos cobrados'
					value={formatCurrency(sales.paidRevenue)}
				/>
				<StatTile
					label='Órdenes'
					value={formatCompactNumber(sales.totalOrders)}
				/>
				<StatTile
					label='Órdenes pagadas'
					value={formatCompactNumber(sales.paidOrders)}
				/>
				<StatTile
					label='Productos'
					value={formatCompactNumber(catalogue.totalProducts)}
				/>
				<StatTile
					label='Usuarios'
					value={formatCompactNumber(catalogue.totalUsers)}
				/>
			</div>

			<Card>
				<CardHeader className='flex flex-row items-center justify-between'>
					<CardTitle>Ventas en el tiempo</CardTitle>
					<div className='flex items-center gap-2'>
						{GROUP_BY_OPTIONS.map((option) => (
							<Button
								key={option.value}
								size='sm'
								className={`text-aromas_fucsia border border-aromas_fucsia ${
									groupBy === option.value
										? 'bg-aromas_pink text-aromas_gray_text'
										: ''
								}`}
								onClick={() => setGroupBy(option.value)}>
								{option.label}
							</Button>
						))}
					</div>
				</CardHeader>
				<CardContent>
					{timeseriesLoading || !timeseries ? (
						<Skeleton className='h-56 w-full' />
					) : (
						<SalesTimeseriesChart points={timeseries.points} />
					)}
				</CardContent>
			</Card>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Más vistos</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-col gap-2'>
						{engagement.topViewed.length === 0 && (
							<span className='text-sm text-aromas_gray_text/70'>
								Sin datos.
							</span>
						)}
						{engagement.topViewed.map((item) => (
							<div
								key={item.product._id}
								className='flex items-center justify-between text-sm'>
								<span>{item.product.name ?? item.product._id}</span>
								<span className='font-medium'>
									{formatCompactNumber(item.value)}
								</span>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Más agregados al carrito</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-col gap-2'>
						{engagement.topAddedToCart.length === 0 && (
							<span className='text-sm text-aromas_gray_text/70'>
								Sin datos.
							</span>
						)}
						{engagement.topAddedToCart.map((item) => (
							<div
								key={item.product._id}
								className='flex items-center justify-between text-sm'>
								<span>{item.product.name ?? item.product._id}</span>
								<span className='font-medium'>
									{formatCompactNumber(item.value)}
								</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Órdenes por estado</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-col gap-2'>
						{sales.ordersByStatus.map((row) => (
							<div
								key={row.status}
								className='flex items-center justify-between text-sm'>
								<span>
									{ORDER_STATUS_LABELS[row.status] ??
										row.status}
								</span>
								<span className='font-medium'>
									{formatCompactNumber(row.count)}
								</span>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Más vendidos</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-col gap-2'>
						{sales.topSold.length === 0 && (
							<span className='text-sm text-aromas_gray_text/70'>
								Sin datos.
							</span>
						)}
						{sales.topSold.map((item) => (
							<div
								key={item.product._id}
								className='flex items-center justify-between text-sm'>
								<span>{item.name}</span>
								<span className='font-medium'>
									{item.quantity} u. · {formatCurrency(item.revenue)}
								</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AnalyticsOverview;
