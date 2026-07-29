import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import TableSkeleton from '../../TableSkeleton';
import type { IProductData } from '@/services/products/models/products.interface';
import { productsGetService } from '@/services/products/GET/products.service.get';
import type { IReview } from '@/services/review/models/review.interface';
import { reviewGetService } from '@/services/review/GET/review.service.get';
import { reviewPutService } from '@/services/review/PUT/review.service.put';
import { reviewDeleteService } from '@/services/review/DELETE/review.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';

const getAuthorLabel = (user: IReview['user']): string => {
	if (typeof user === 'string') return user;
	return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Usuario';
};

const ReviewsList = () => {
	const [productSearch, setProductSearch] = useState('');
	const [products, setProducts] = useState<IProductData[]>([]);
	const [productsLoading, setProductsLoading] = useState(true);
	const [selectedProductId, setSelectedProductId] = useState<string | null>(
		null
	);
	const [reviews, setReviews] = useState<IReview[]>([]);
	const [reviewsLoading, setReviewsLoading] = useState(false);
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const getProducts = async () => {
		setProductsLoading(true);
		try {
			const result = await productsGetService.getProducts({
				search: productSearch || undefined,
				isActive: true,
				limit: 50,
			});
			if (result?.data) {
				setProducts(result.data);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			toast.error('No se pudieron cargar los productos.');
		} finally {
			setProductsLoading(false);
		}
	};

	const getReviews = async (productId: string) => {
		setReviewsLoading(true);
		try {
			const result = await reviewGetService.getProductReviews(productId, {
				limit: 50,
			});
			if (result?.data) {
				setReviews(result.data);
			}
		} catch (error) {
			console.error('Error fetching reviews:', error);
			toast.error('No se pudieron cargar las reseñas.');
		} finally {
			setReviewsLoading(false);
		}
	};

	useEffect(() => {
		getProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productSearch]);

	useEffect(() => {
		if (!selectedProductId) {
			setReviews([]);
			return;
		}
		getReviews(selectedProductId);
	}, [selectedProductId]);

	const handleToggleActive = async (review: IReview) => {
		setTogglingId(review._id);
		try {
			await reviewPutService.updateReview(review._id, {
				isActive: !review.isActive,
			});
			toast.success('Estado de la reseña actualizado.');
			if (selectedProductId) getReviews(selectedProductId);
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo actualizar la reseña.')
			);
		} finally {
			setTogglingId(null);
		}
	};

	const handleDelete = async (review: IReview) => {
		const confirmed = window.confirm(
			'¿Seguro que querés eliminar esta reseña?'
		);
		if (!confirmed) return;

		setDeletingId(review._id);
		try {
			await reviewDeleteService.deleteReview(review._id);
			toast.success('Reseña eliminada con éxito.');
			if (selectedProductId) getReviews(selectedProductId);
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo eliminar la reseña.')
			);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className='w-full p-4'>
			<div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center'>
				<Input
					placeholder='Buscar producto...'
					value={productSearch}
					onChange={(event) => setProductSearch(event.target.value)}
					className='sm:max-w-xs'
				/>
				<Select
					value={selectedProductId ?? undefined}
					onValueChange={(value) => setSelectedProductId(value)}
					disabled={productsLoading}>
					<SelectTrigger className='sm:w-72'>
						<SelectValue placeholder='Seleccioná un producto' />
					</SelectTrigger>
					<SelectContent>
						{products.map((product) => (
							<SelectItem key={product._id} value={product._id}>
								{product.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{!selectedProductId && (
				<p className='text-center text-aromas_gray_text py-6'>
					Seleccioná un producto para ver sus reseñas.
				</p>
			)}

			{selectedProductId && reviewsLoading && <TableSkeleton />}

			{selectedProductId && !reviewsLoading && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Usuario</TableHead>
							<TableHead className='text-center'>
								Puntaje
							</TableHead>
							<TableHead>Comentario</TableHead>
							<TableHead className='text-center'>Activa</TableHead>
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{reviews.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className='text-center text-aromas_gray_text'>
									Este producto todavía no tiene reseñas.
								</TableCell>
							</TableRow>
						)}
						{reviews.map((review) => (
							<TableRow key={review._id}>
								<TableCell className='font-medium'>
									{getAuthorLabel(review.user)}
								</TableCell>
								<TableCell className='text-center'>
									{review.rating}/5
								</TableCell>
								<TableCell>{review.comment || '-'}</TableCell>
								<TableCell className='text-center'>
									<Badge
										variant={
											review.isActive
												? 'default'
												: 'destructive'
										}>
										{review.isActive ? 'Activa' : 'Inactiva'}
									</Badge>
								</TableCell>
								<TableCell className='text-right'>
									<div className='flex items-center justify-end gap-2'>
										<Switch
											className='bg-aromas_pink'
											checked={review.isActive}
											disabled={togglingId === review._id}
											onCheckedChange={() =>
												handleToggleActive(review)
											}
										/>
										<Button
											variant='ghost'
											size='icon'
											disabled={deletingId === review._id}
											onClick={() => handleDelete(review)}>
											<Trash2 className='h-4 w-4 text-red-600' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default ReviewsList;
