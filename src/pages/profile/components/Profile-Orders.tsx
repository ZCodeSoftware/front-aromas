import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import productImage from '../../../mocks/products/product-image/dd0ae5f22f356d984fc7741ecaf2df9dcda764a3.png';
import { orderGetService } from '@/services/order/GET/order.service.get';
import { orderPatchService } from '@/services/order/PATCH/order.service.patch';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type {
	IOrder,
	IOrderStatus,
	IOrderStatusCode,
	IPaginationMeta,
} from '@/services/order/models/order.interface';

/**
 * Only the colour lives here. The label comes from the cat-order-status row the
 * API populates on every order, so renaming a status from the catalogue does not
 * need a deploy, and a status this map does not know still renders.
 */
const STATUS_STYLES: Partial<Record<IOrderStatusCode, string>> = {
	PENDING: 'bg-[#FEF9C3] text-yellow-700',
	PAID: 'bg-[#DBEAFE] text-blue-700',
	SHIPPED: 'bg-[#E0E7FF] text-indigo-700',
	DELIVERED: 'bg-[#DCFCE7] text-aromas_success',
	CANCELLED: 'bg-[#FEE2E2] text-red-700',
	REFUNDED: 'bg-[#FEE2E2] text-red-700',
};

const statusStyle = (status: IOrderStatus) =>
	STATUS_STYLES[status.code] ?? 'bg-[#F3F4F6] text-aromas_gray_text';

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('es-AR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

const ProfileOrders = () => {
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [pagination, setPagination] = useState<IPaginationMeta | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState(false);
	const [cancellingId, setCancellingId] = useState<string | null>(null);

	const fetchOrders = async (page: number) => {
		if (page === 1) {
			setLoading(true);
		} else {
			setLoadingMore(true);
		}
		setError(false);
		try {
			const response = await orderGetService.getMyOrders({
				page,
				limit: 10,
			});
			setOrders((prev) =>
				page === 1 ? response.data : [...prev, ...response.data],
			);
			setPagination(response.pagination);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		fetchOrders(1);
	}, []);

	const handleCancel = async (order: IOrder) => {
		const confirmed = window.confirm(
			'¿Seguro que querés cancelar este pedido?',
		);
		if (!confirmed) return;

		setCancellingId(order._id);
		try {
			const updatedOrder = await orderPatchService.cancelOrder(order._id);
			setOrders((prev) =>
				prev.map((o) => (o._id === order._id ? updatedOrder : o)),
			);
			toast.success('Pedido cancelado con éxito.');
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo cancelar el pedido.'),
			);
		} finally {
			setCancellingId(null);
		}
	};

	if (loading) {
		return (
			<main className='flex-1 p-6'>
				<p className='text-center text-aromas_gray_text py-6'>
					Cargando tus pedidos...
				</p>
			</main>
		);
	}

	if (error) {
		return (
			<main className='flex-1 p-6'>
				<div className='flex flex-col items-center gap-y-3 py-6'>
					<p className='text-center text-sm text-red-600'>
						No pudimos cargar tus pedidos.
					</p>
					<button
						onClick={() => fetchOrders(1)}
						className='text-sm font-semibold text-aromas_fucsia underline underline-offset-2'>
						Reintentar
					</button>
				</div>
			</main>
		);
	}

	if (orders.length === 0) {
		return (
			<main className='flex-1 p-6'>
				<p className='text-center text-aromas_gray_text py-6'>
					Todavía no hiciste ningún pedido.
				</p>
			</main>
		);
	}

	return (
		<main className='flex-1 p-6 overflow-y-auto'>
			<div className='flex flex-col gap-y-8'>
				{orders.map((order) => (
					<div
						key={order._id}
						className='w-full border-b border-aromas_gray_line pb-6 last:border-none'>
						<div className='flex flex-col text-sm mb-4'>
							<div className='flex justify-between items-center'>
								<p className='font-semibold'>{`Pedido #${order.orderNumber}`}</p>
								<Badge className={statusStyle(order.status)}>
									{order.status.name}
								</Badge>
							</div>
							<span className='text-aromas_gray_text'>
								{formatDate(order.createdAt)}
							</span>
						</div>
						<div className='flex flex-col gap-y-4 mb-4'>
							{order.items.map((item, index) => (
								<div
									key={`${order._id}-${index}`}
									className='flex items-center space-x-4 rounded-lg'>
									<img
										src={
											item.product?.images?.[0] ||
											item.combo?.images?.[0] ||
											productImage
										}
										alt={item.name}
										className='w-16 h-16 rounded-lg object-cover bg-white'
									/>
									<div className='w-full'>
										<p className='text-aromas_gray_text font-bold'>
											{item.name}
											{item.itemType === 'COMBO' && (
												<span className='ml-2 rounded bg-aromas_fucsia px-1.5 py-0.5 text-xs text-white'>
													COMBO
												</span>
											)}
										</p>
										{/* The snapshot of what the combo held when it
										    was bought, so the receipt stays readable
										    even if the combo was edited since. */}
										{!!item.components?.length && (
											<p className='text-xs text-aromas_gray_text'>
												{item.components
													.map(
														(component) =>
															`${component.quantity} x ${component.name}`
													)
													.join(' · ')}
											</p>
										)}
										<div className='w-2/4 flex justify-between'>
											<p className='text-aromas_gray_text font-medium'>
												{`Cantidad: ${item.quantity}`}
											</p>
											<span>x</span>
											<p className='text-aromas_gray_text font-medium'>
												${item.unitPrice}
											</p>
										</div>
										{!!item.discount && (
											<p className='text-xs text-aromas_fucsia'>
												{`Descuento: -$${item.discount.toFixed(2)}`}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
						<div className='flex flex-col gap-y-1 text-sm mb-2'>
							<div className='flex justify-between'>
								<span className='text-aromas_gray_text'>
									Subtotal
								</span>
								<span className='text-aromas_gray_text'>
									${order.subTotalPrice}
								</span>
							</div>
							{!!order.discountTotal && (
								<div className='flex justify-between'>
									<span className='text-aromas_fucsia'>
										Descuento
										{order.coupon && ` (${order.coupon})`}
									</span>
									<span className='text-aromas_fucsia'>
										-${order.discountTotal.toFixed(2)}
									</span>
								</div>
							)}
							{order.shippingPrice > 0 && (
								<div className='flex justify-between'>
									<span className='text-aromas_gray_text'>
										Envío
									</span>
									<span className='text-aromas_gray_text'>
										${order.shippingPrice}
									</span>
								</div>
							)}
						</div>
						<div className='flex justify-between text-lg mb-4'>
							<h2 className='text-aromas_gray_text font-semibold'>
								Total
							</h2>
							<p className='text-aromas_fucsia font-semibold'>
								${order.totalPrice}
							</p>
						</div>
						{order.status.code === 'PENDING' && (
							<div className='flex justify-end'>
								<Button
									onClick={() => handleCancel(order)}
									disabled={cancellingId === order._id}
									variant='outline'
									className='border-red-600 text-red-600 rounded-3xl'>
									{cancellingId === order._id
										? 'Cancelando...'
										: 'Cancelar pedido'}
								</Button>
							</div>
						)}
					</div>
				))}
				{pagination?.hasNextPage && (
					<div className='flex justify-center'>
						<button
							onClick={() =>
								fetchOrders(pagination.currentPage + 1)
							}
							disabled={loadingMore}
							className='text-sm font-semibold text-aromas_fucsia underline underline-offset-2 disabled:opacity-50'>
							{loadingMore ? 'Cargando...' : 'Cargar más'}
						</button>
					</div>
				)}
			</div>
		</main>
	);
};

export default ProfileOrders;
