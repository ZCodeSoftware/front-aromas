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
	const [failed, setFailed] = useState(false);
	const [refundingId, setRefundingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		setFailed(false);
		try {
			const result = await posGetService.getSales();
			// Falling back to an empty list keeps a malformed response from
			// leaving the rows of the previous load on screen.
			setSales(result?.data ?? []);
		} catch (error) {
			console.error('Error fetching POS sales:', error);
			setSales([]);
			setFailed(true);
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
			`¿Seguro que querés reembolsar la venta #${sale.orderNumber}?`
		);
		if (!confirmed) return;

		setRefundingId(sale._id);
		try {
			const refundedSale = await posPatchService.refundSale(sale._id);
			// The endpoint returns the updated sale, so the row is patched in
			// place. Re-listing instead could fail after a refund that already
			// went through, leaving a refunded sale still offering the button.
			setSales((prev) =>
				prev.map((s) => (s._id === sale._id ? refundedSale : s))
			);
			toast.success('Venta reembolsada con éxito.');
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
			<Table data-tutorial='sales-table'>
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
					{failed && (
						<TableRow>
							<TableCell
								colSpan={5}
								className='text-center text-aromas_gray_text'>
								<span className='mr-3'>
									No se pudieron cargar las ventas.
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={getData}>
									Reintentar
								</Button>
							</TableCell>
						</TableRow>
					)}
					{!failed && sales.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className='text-center text-aromas_gray_text'>
								Todavía no hay ventas registradas.
							</TableCell>
						</TableRow>
					)}
					{sales.map((sale) => {
						// `status` arrives as the populated catalogue row, so the
						// labels and the refund guard both read its code.
						const statusCode = sale.status?.code;
						return (
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
									<Badge
										variant={STATUS_VARIANTS[statusCode]}>
										{STATUS_LABELS[statusCode] ??
											sale.status?.name ??
											'Sin estado'}
									</Badge>
								</TableCell>
								<TableCell className='text-right'>
									{statusCode !== 'REFUNDED' && (
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
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default SalesList;
