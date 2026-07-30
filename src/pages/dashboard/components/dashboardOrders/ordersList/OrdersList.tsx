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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TableSkeleton from '../../TableSkeleton';
import { orderGetService } from '@/services/order/GET/order.service.get';
import { orderPatchService } from '@/services/order/PATCH/order.service.patch';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type {
	IOrder,
	IOrderChannel,
	IOrderStatusCode,
	IPaginationMeta,
} from '@/services/order/models/order.interface';

const STATUS_LABELS: Record<IOrderStatusCode, string> = {
	PENDING: 'Pendiente',
	PAID: 'Pagado',
	SHIPPED: 'Enviado',
	DELIVERED: 'Entregado',
	CANCELLED: 'Cancelado',
	REFUNDED: 'Reembolsado',
};

const STATUS_STYLES: Record<IOrderStatusCode, string> = {
	PENDING: 'bg-[#FEF9C3] text-yellow-700',
	PAID: 'bg-[#DBEAFE] text-blue-700',
	SHIPPED: 'bg-[#E0E7FF] text-indigo-700',
	DELIVERED: 'bg-[#DCFCE7] text-aromas_success',
	CANCELLED: 'bg-[#FEE2E2] text-red-700',
	REFUNDED: 'bg-[#F3E8FF] text-purple-700',
};

const CHANNEL_LABELS: Record<IOrderChannel, string> = {
	ONLINE: 'Online',
	POS: 'Punto de venta',
};

const ALLOWED_TRANSITIONS: Record<IOrderStatusCode, IOrderStatusCode[]> = {
	PENDING: ['PAID', 'CANCELLED'],
	PAID: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
	SHIPPED: ['DELIVERED'],
	DELIVERED: [],
	CANCELLED: [],
	REFUNDED: [],
};

/**
 * An online order carries the populated account, a counter sale its own buyer
 * snapshot, and a walk-in may carry nothing at all. Never falls back to the id:
 * that is what the column used to show.
 */
const getCustomerLabels = (order: IOrder) => {
	const accountName = [order.user?.firstName, order.user?.lastName]
		.filter(Boolean)
		.join(' ')
		.trim();
	const name = order.customer?.name?.trim() || accountName;
	const email = order.customer?.email || order.user?.email || '';
	const phone = order.customer?.phone?.trim() || '';

	if (name) return { primary: name, secondary: email || phone };
	if (email) return { primary: email, secondary: phone };
	if (phone) return { primary: phone, secondary: '' };

	return {
		primary: order.channel === 'POS' ? 'Consumidor final' : 'Sin datos',
		secondary: '',
	};
};

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('es-AR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

const OrdersList = () => {
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [pagination, setPagination] = useState<IPaginationMeta | null>(null);
	const [loading, setLoading] = useState(true);
	const [failed, setFailed] = useState(false);
	/** Page that was last requested, so a failed load knows what to retry. */
	const [requestedPage, setRequestedPage] = useState(1);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	const fetchOrders = async (page: number) => {
		setLoading(true);
		setFailed(false);
		setRequestedPage(page);
		try {
			const response = await orderGetService.getAllOrders({
				page,
				limit: 10,
			});
			setOrders(response.data);
			setPagination(response.pagination);
		} catch (error) {
			console.error('Error fetching orders:', error);
			// Dropping the rows is deliberate: keeping the previous page would leave
			// the table and the paginator disagreeing about what is on screen.
			setOrders([]);
			setPagination(null);
			setFailed(true);
			toast.error('No se pudieron cargar los pedidos.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders(1);
	}, []);

	const handleStatusChange = async (order: IOrder, status: IOrderStatusCode) => {
		const confirmed = window.confirm(
			`¿Seguro que querés cambiar el pedido #${order.orderNumber} a "${STATUS_LABELS[status]}"?`
		);
		if (!confirmed) return;

		setUpdatingId(order._id);
		try {
			const updatedOrder = await orderPatchService.changeOrderStatus(
				order._id,
				status
			);
			setOrders((prev) =>
				prev.map((o) => (o._id === order._id ? updatedOrder : o))
			);
			toast.success('Estado del pedido actualizado con éxito.');
		} catch (error) {
			toast.error(
				getApiErrorMessage(
					error,
					'No se pudo actualizar el estado del pedido.'
				)
			);
		} finally {
			setUpdatingId(null);
		}
	};

	if (loading) {
		return <TableSkeleton />;
	}

	return (
		<div className='w-full p-4'>
			<Table data-tutorial='orders-table'>
				<TableHeader>
					<TableRow>
						<TableHead>Pedido</TableHead>
						<TableHead>Cliente</TableHead>
						<TableHead>Canal</TableHead>
						<TableHead className='text-right'>Total</TableHead>
						<TableHead>Fecha</TableHead>
						<TableHead className='text-center'>Estado</TableHead>
						<TableHead className='text-right'>
							Cambiar estado
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{failed && (
						<TableRow>
							<TableCell
								colSpan={7}
								className='text-center text-aromas_gray_text'>
								<span className='mr-3'>
									No se pudieron cargar los pedidos.
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={() => fetchOrders(requestedPage)}>
									Reintentar
								</Button>
							</TableCell>
						</TableRow>
					)}
					{!failed && orders.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={7}
								className='text-center text-aromas_gray_text'>
								Todavía no hay pedidos.
							</TableCell>
						</TableRow>
					)}
					{orders.map((order) => {
						// The API populates `status` as the catalogue row, so every
						// lookup here goes through its code, never the row itself.
						const statusCode = order.status?.code;
						const nextStatuses =
							ALLOWED_TRANSITIONS[statusCode] ?? [];
						const customer = getCustomerLabels(order);
						return (
							<TableRow key={order._id}>
								<TableCell className='font-medium'>
									{`#${order.orderNumber}`}
								</TableCell>
								<TableCell>
									<div className='flex flex-col'>
										<span>{customer.primary}</span>
										{customer.secondary && (
											<span className='text-xs text-aromas_gray_text'>
												{customer.secondary}
											</span>
										)}
									</div>
								</TableCell>
								<TableCell>
									{CHANNEL_LABELS[order.channel ?? 'ONLINE']}
								</TableCell>
								<TableCell className='text-right'>
									${order.totalPrice}
								</TableCell>
								<TableCell>
									{formatDate(order.createdAt)}
								</TableCell>
								<TableCell className='text-center'>
									<Badge
										className={
											STATUS_STYLES[statusCode] ?? ''
										}>
										{STATUS_LABELS[statusCode] ??
											order.status?.name ??
											'Sin estado'}
									</Badge>
								</TableCell>
								<TableCell className='text-right'>
									{nextStatuses.length === 0 ? (
										<span className='text-sm text-aromas_gray_text'>
											Sin acciones disponibles
										</span>
									) : (
										<Select
											disabled={
												updatingId === order._id
											}
											onValueChange={(value) =>
												handleStatusChange(
													order,
													value as IOrderStatusCode
												)
											}
											value=''>
											<SelectTrigger className='w-40 ml-auto'>
												<SelectValue placeholder='Cambiar estado' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{nextStatuses.map((status) => (
													<SelectItem
														key={status}
														value={status}>
														{
															STATUS_LABELS[
																status
															]
														}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{pagination && (
				<div
					data-tutorial='orders-pagination'
					className='flex items-center justify-end gap-x-4 pt-4'>
					<Button
						variant='outline'
						size='sm'
						disabled={!pagination.hasPrevPage || loading}
						onClick={() =>
							fetchOrders(pagination.currentPage - 1)
						}>
						Anterior
					</Button>
					<span className='text-sm text-aromas_gray_text'>
						{`Página ${pagination.currentPage} de ${pagination.totalPages}`}
					</span>
					<Button
						variant='outline'
						size='sm'
						disabled={!pagination.hasNextPage || loading}
						onClick={() =>
							fetchOrders(pagination.currentPage + 1)
						}>
						Siguiente
					</Button>
				</div>
			)}
		</div>
	);
};

export default OrdersList;
