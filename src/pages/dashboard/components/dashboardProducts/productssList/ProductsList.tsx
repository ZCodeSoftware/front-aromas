import { useState } from 'react';
import { Pencil } from 'lucide-react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { IProductData } from '@/services/products/models/products.interface';
import { productsGetService } from '@/services/products/GET/products.service.get';
import TableSkeleton from '../../TableSkeleton';
import ShowInactiveToggle from '../../ShowInactiveToggle';
import { useActiveRecordsList } from '@/pages/dashboard/hooks/useActiveRecordsList';
import UpdateProduct from '../updateProduct/UpdateProduct';
import { putProduct } from '@/services/products/PUT/products.service.put';

const ProductsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
		null
	);

	const {
		items: productsData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IProductData>({
		fetchItems: async (includeInactive) => {
			const result = includeInactive
				? await productsGetService.getProductsIncludingInactive()
				: await productsGetService.getProducts();
			return result?.data ?? [];
		},
		setItemActive: (id, isActive) => putProduct(id, { isActive }),
		loadErrorMessage: 'No se pudieron cargar los productos.',
		toggleErrorMessage: 'No se pudo actualizar el estado del producto.',
	});

	const handleEditClick = (product: IProductData) => {
		setSelectedProduct(product);
		setOpenUpdateModal(true);
	};

	return (
		<TooltipProvider>
			<div className='w-full p-4'>
				<div className='w-full flex justify-end mb-4'>
					<ShowInactiveToggle
						checked={showInactive}
						onCheckedChange={setShowInactive}
					/>
				</div>
				{loading ? (
					<TableSkeleton />
				) : (
					<Table data-tutorial='products-table'>
						<TableHeader>
							<TableRow>
								<TableHead>Nombre</TableHead>
								<TableHead>Categoría</TableHead>
								<TableHead>Marca</TableHead>
								<TableHead className='text-right'>Precio</TableHead>
								<TableHead className='text-right'>Stock</TableHead>
								<TableHead className='text-right'>Activo</TableHead>
								<TableHead className='text-right'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{productsData.map((product) => (
								<TableRow
									key={product._id}
									className={product.isActive ? '' : 'opacity-50'}>
									<TableCell className='font-medium'>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className='cursor-help border-b border-dashed border-gray-400'>
													{product.name}
												</span>
											</TooltipTrigger>
											<TooltipContent className='bg-white'>
												<p className='max-w-sm text-sm'>
													{product.description ||
														'Sin descripción'}
												</p>
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell>
										{product.category?.name || 'N/A'}
									</TableCell>
									<TableCell>
										{product.brand?.name || 'N/A'}
									</TableCell>
									<TableCell className='text-right'>
										${product.price.toFixed(2)}
									</TableCell>
									<TableCell className='text-right'>
										{product.stock}
									</TableCell>
									<TableCell className='text-right'>
										<Switch
											className='bg-aromas_pink'
											checked={product.isActive}
											disabled={togglingId === product._id}
											onCheckedChange={() =>
												toggleActive(product)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												handleEditClick(product)
											}>
											<Pencil className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedProduct && (
				<UpdateProduct
					productData={selectedProduct}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					productId={selectedProduct._id}
					onUpdate={refresh}
				/>
			)}
		</TooltipProvider>
	);
};

export default ProductsList;
