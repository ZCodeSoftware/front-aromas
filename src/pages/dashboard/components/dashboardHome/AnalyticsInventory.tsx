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
import type { IInventoryReport, IStockProduct } from '@/services/analytics/models/analytics.interface';
import StatTile from './StatTile';
import { formatCompactNumber, formatCurrency } from './utils/format';

const StockTable = ({ items }: { items: IStockProduct[] }) => {
	if (items.length === 0) {
		return (
			<span className='text-sm text-aromas_gray_text/70'>Sin datos.</span>
		);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Producto</TableHead>
					<TableHead className='text-right'>Stock</TableHead>
					<TableHead className='text-right'>Precio</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => (
					<TableRow key={item._id}>
						<TableCell className='font-medium'>{item.name}</TableCell>
						<TableCell className='text-right'>{item.stock}</TableCell>
						<TableCell className='text-right'>
							{formatCurrency(item.price)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

const AnalyticsInventory = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<IInventoryReport | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await analyticsGetService.getInventory();
			setData(result);
		} catch (error) {
			console.error('Error fetching inventory analytics:', error);
			toast.error('No se pudo cargar el estado del inventario.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	if (loading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-5 gap-4 p-4'>
				{Array.from({ length: 5 }).map((_, index) => (
					<Skeleton key={index} className='h-24 w-full rounded-xl' />
				))}
			</div>
		);
	}

	if (!data) {
		return (
			<div className='w-full p-8 text-center text-sm text-aromas_gray_text/70'>
				No se pudo cargar el estado del inventario.
			</div>
		);
	}

	const { summary, lowStock, outOfStock, deadStock } = data;

	return (
		<div className='w-full flex flex-col gap-4 p-4'>
			<div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
				<StatTile
					label='Productos activos'
					value={formatCompactNumber(summary.activeProducts)}
				/>
				<StatTile
					label='Unidades en stock'
					value={formatCompactNumber(summary.unitsInStock)}
				/>
				<StatTile
					label='Valor a precio de venta'
					value={formatCurrency(summary.inventoryValueAtSalePrice)}
				/>
				<StatTile
					label='Sin stock'
					value={formatCompactNumber(summary.outOfStockCount)}
				/>
				<StatTile
					label='Stock bajo'
					value={formatCompactNumber(summary.lowStockCount)}
					hint={`Umbral: ${summary.lowStockThreshold} u.`}
				/>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Stock bajo</CardTitle>
					</CardHeader>
					<CardContent>
						<StockTable items={lowStock} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Sin stock</CardTitle>
					</CardHeader>
					<CardContent>
						<StockTable items={outOfStock} />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Stock estancado</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<div className='flex flex-wrap gap-6 text-sm'>
						<span>
							Productos:{' '}
							<span className='font-medium'>
								{formatCompactNumber(deadStock.count)}
							</span>
						</span>
						<span>
							Valor:{' '}
							<span className='font-medium'>
								{formatCurrency(deadStock.valueAtSalePrice)}
							</span>
						</span>
					</div>
					<span className='text-xs text-aromas_gray_text/70'>
						{deadStock.definition}
					</span>
					<StockTable items={deadStock.items} />
				</CardContent>
			</Card>
		</div>
	);
};

export default AnalyticsInventory;
