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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TableSkeleton from '../../TableSkeleton';
import { posGetService } from '@/services/pos/GET/pos.service.get';
import { posPatchService } from '@/services/pos/PATCH/pos.service.patch';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { IOrder } from '@/services/order/models/order.interface';

const STATUS_LABELS: Record<string, string> = {
	PENDING: 'Pendiente',
	PAID: 'Pagado',
	SHIPPED: 'Enviado',
	DELIVERED: 'Entregado',
	CANCELLED: 'Cancelado',
	REFUNDED: 'Reembolsado',
};

const STATUS_VARIANTS: Record<
	string,
	'default' | 'secondary' | 'destructive' | 'outline'
> = {
	PENDING: 'secondary',
	PAID: 'default',
	SHIPPED: 'default',
	DELIVERED: 'default',
	CANCELLED: 'destructive',
	REFUNDED: 'destructive',
};

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('es-AR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

const summarizeItems = (sale: IOrder) =>
	sale.items.map((item) => `${item.name} x${item.quantity}`).join(', ');

const SalesList = () => {
	const [loading, setLoading] = useState(true);
	const [sales, setSales] = useState<IOrder[]>([]);
	const [refundingId, setRefundingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await posGetService.getSales();
			if (result?.data) {
				setSales(result.data);
			}
		} catch (error) {
			console.error('Error fetching POS sales:', error);
			toast.error('No se pudieron cargar las ventas.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleRefund = async (sale: IOrder) => {
		const confirmed = window.confirm(
			`¿Seguro que querés reembolsar la venta #${sale._id.slice(-6).toUpperCase()}?`
		);
		if (!confirmed) return;

		setRefundingId(sale._id);
		try {
			await posPatchService.refundSale(sale._id);
			toast.success('Venta reembolsada con éxito.');
			getData();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo reembolsar la venta.')
			);
		} finally {
			setRefundingId(null);
		}
	};

	if (loading) {
		return <TableSkeleton />;
	}

	return (
		<div className='w-full p-4'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Fecha</TableHead>
						<TableHead>Productos</TableHead>
						<TableHead className='text-right'>Total</TableHead>
						<TableHead className='text-center'>Estado</TableHead>
						<TableHead className='text-right'>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sales.map((sale) => (
						<TableRow key={sale._id}>
							<TableCell className='font-medium'>
								{formatDate(sale.createdAt)}
							</TableCell>
							<TableCell className='max-w-xs truncate'>
								{summarizeItems(sale)}
							</TableCell>
							<TableCell className='text-right'>
								${sale.totalPrice.toFixed(2)}
							</TableCell>
							<TableCell className='text-center'>
								<Badge variant={STATUS_VARIANTS[sale.status]}>
									{STATUS_LABELS[sale.status] ?? sale.status}
								</Badge>
							</TableCell>
							<TableCell className='text-right'>
								{(sale.status as string) !== 'REFUNDED' && (
									<Button
										variant='outline'
										size='sm'
										disabled={refundingId === sale._id}
										onClick={() => handleRefund(sale)}
										className='border-red-600 text-red-600'>
										{refundingId === sale._id
											? 'Reembolsando...'
											: 'Reembolsar'}
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default SalesList;
