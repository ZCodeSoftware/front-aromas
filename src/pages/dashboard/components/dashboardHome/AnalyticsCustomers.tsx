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
import type { ICustomersReport } from '@/services/analytics/models/analytics.interface';
import StatTile from './StatTile';
import { formatCompactNumber, formatCurrency } from './utils/format';

const AnalyticsCustomers = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<ICustomersReport | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await analyticsGetService.getCustomers();
			setData(result);
		} catch (error) {
			console.error('Error fetching customers analytics:', error);
			toast.error('No se pudieron cargar los clientes.');
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
				No se pudieron cargar los clientes.
			</div>
		);
	}

	const { topCustomers, cohorts, anonymous, range } = data;

	return (
		<div className='w-full flex flex-col gap-4 p-4'>
			<span className='text-xs text-aromas_gray_text/70'>
				Rango: {range.dateFrom} a {range.dateTo} ({range.timezone})
			</span>

			<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
				<StatTile
					label='Clientes nuevos'
					value={formatCompactNumber(cohorts.newCustomers)}
				/>
				<StatTile
					label='Clientes recurrentes'
					value={formatCompactNumber(cohorts.returningCustomers)}
				/>
				<StatTile
					label='Órdenes de nuevos'
					value={formatCompactNumber(cohorts.ordersFromNew)}
				/>
				<StatTile
					label='Órdenes de recurrentes'
					value={formatCompactNumber(cohorts.ordersFromReturning)}
				/>
				<StatTile
					label='Ingresos de nuevos'
					value={formatCurrency(cohorts.revenueFromNew)}
				/>
				<StatTile
					label='Ingresos de recurrentes'
					value={formatCurrency(cohorts.revenueFromReturning)}
				/>
			</div>
			<span className='text-xs text-aromas_gray_text/70'>
				{cohorts.definition}
			</span>

			<Card>
				<CardHeader>
					<CardTitle>Ventas anónimas</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-2'>
					<div className='flex flex-wrap gap-6 text-sm'>
						<span>
							Órdenes:{' '}
							<span className='font-medium'>
								{formatCompactNumber(anonymous.orders)}
							</span>
						</span>
						<span>
							Ingresos:{' '}
							<span className='font-medium'>
								{formatCurrency(anonymous.revenue)}
							</span>
						</span>
					</div>
					<span className='text-xs text-aromas_gray_text/70'>
						{anonymous.note}
					</span>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Mejores clientes</CardTitle>
				</CardHeader>
				<CardContent>
					{topCustomers.length === 0 ? (
						<span className='text-sm text-aromas_gray_text/70'>
							Sin datos.
						</span>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Cliente</TableHead>
									<TableHead className='text-right'>Órdenes</TableHead>
									<TableHead className='text-right'>Ingresos</TableHead>
									<TableHead className='text-right'>
										Última orden
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topCustomers.map((customer) => (
									<TableRow key={customer.userId}>
										<TableCell className='font-medium'>
											{[customer.firstName, customer.lastName]
												.filter(Boolean)
												.join(' ') ||
												customer.email ||
												customer.userId}
										</TableCell>
										<TableCell className='text-right'>
											{customer.orders}
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(customer.revenue)}
										</TableCell>
										<TableCell className='text-right'>
											{new Date(
												customer.lastOrderAt
											).toLocaleDateString('es-AR')}
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

export default AnalyticsCustomers;
