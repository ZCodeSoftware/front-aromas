import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { analyticsGetService } from '@/services/analytics/GET/analytics.service.get';
import type { ISalesBreakdown } from '@/services/analytics/models/analytics.interface';
import StatTile from './StatTile';
import { formatCompactNumber, formatCurrency, formatPercent } from './utils/format';

const CHANNEL_LABELS: Record<string, string> = {
	ONLINE: 'Tienda Online',
	POS: 'Punto de Venta',
};

const AnalyticsSalesBreakdown = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<ISalesBreakdown | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await analyticsGetService.getSalesBreakdown();
			setData(result);
		} catch (error) {
			console.error('Error fetching sales breakdown:', error);
			toast.error('No se pudo cargar la distribución de ventas.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	if (loading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4'>
				{Array.from({ length: 4 }).map((_, index) => (
					<Skeleton key={index} className='h-24 w-full rounded-xl' />
				))}
			</div>
		);
	}

	if (!data) {
		return (
			<div className='w-full p-8 text-center text-sm text-aromas_gray_text/70'>
				No se pudo cargar la distribución de ventas.
			</div>
		);
	}

	const { totals, byChannel, byPaymentMethod, matrix } = data;

	return (
		<div className='w-full flex flex-col gap-4 p-4'>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				<StatTile
					label='Órdenes'
					value={formatCompactNumber(totals.orders)}
				/>
				<StatTile
					label='Ingresos'
					value={formatCurrency(totals.revenue)}
				/>
				<StatTile
					label='Órdenes pagadas'
					value={formatCompactNumber(totals.paidOrders)}
				/>
				<StatTile
					label='Ingresos cobrados'
					value={formatCurrency(totals.paidRevenue)}
				/>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Por canal</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Canal</TableHead>
									<TableHead className='text-right'>Órdenes</TableHead>
									<TableHead className='text-right'>Ingresos</TableHead>
									<TableHead className='text-right'>%</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{byChannel.map((row) => (
									<TableRow key={row.channel}>
										<TableCell className='font-medium'>
											{CHANNEL_LABELS[row.channel] ??
												row.channel}
										</TableCell>
										<TableCell className='text-right'>
											{row.orders}
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(row.revenue)}
										</TableCell>
										<TableCell className='text-right'>
											{formatPercent(row.share)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Por método de pago</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Método</TableHead>
									<TableHead className='text-right'>Órdenes</TableHead>
									<TableHead className='text-right'>Ingresos</TableHead>
									<TableHead className='text-right'>%</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{byPaymentMethod.map((row) => (
									<TableRow
										key={row.paymentMethodId ?? row.name}>
										<TableCell className='font-medium'>
											{row.name}
										</TableCell>
										<TableCell className='text-right'>
											{row.orders}
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(row.revenue)}
										</TableCell>
										<TableCell className='text-right'>
											{formatPercent(row.share)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Canal x método de pago</CardTitle>
				</CardHeader>
				<CardContent>
					{matrix.length === 0 ? (
						<span className='text-sm text-aromas_gray_text/70'>
							Sin datos.
						</span>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Canal</TableHead>
									<TableHead>Método</TableHead>
									<TableHead className='text-right'>Órdenes</TableHead>
									<TableHead className='text-right'>Ingresos</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{matrix.map((cell) => (
									<TableRow
										key={`${cell.channel}-${cell.paymentMethodId ?? cell.name}`}>
										<TableCell>
											{CHANNEL_LABELS[cell.channel] ??
												cell.channel}
										</TableCell>
										<TableCell>{cell.name}</TableCell>
										<TableCell className='text-right'>
											{cell.orders}
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(cell.revenue)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AnalyticsSalesBreakdown;
