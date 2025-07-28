import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
import UpdateProduct from '../updateProduct/UpdateProduct';
import { putProduct } from '@/services/products/PUT/products.service.put';

const ProductsList = () => {
	const [loading, setLoading] = useState(true);
	const [productsData, setProductsData] = useState<IProductData[]>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
		null
	);

	const getData = async () => {
		setLoading(true);
		try {
			const productsResult = await productsGetService.getProducts();
			if (productsResult?.data) {
				setProductsData(productsResult.data);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			toast.error('No se pudieron cargar los productos.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (product: IProductData) => {
		setSelectedProduct(product);
		setOpenUpdateModal(true);
	};

	const handleStatusChange = async (
		productId: string,
		newStatus: boolean
	) => {
		try {
			setProductsData((prevProducts) =>
				prevProducts.map((product) =>
					product._id === productId
						? { ...product, isActive: newStatus }
						: product
				)
			);
			putProduct(productId, { isActive: newStatus });
			toast.success('Estado del producto actualizado.');
		} catch {
			toast.error('Error al actualizar el estado.');
		}
	};

	if (loading) {
		return <TableSkeleton />;
	}

	return (
		<TooltipProvider>
			<div className='w-full p-4'>
				<Table>
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
							<TableRow key={product._id}>
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
										onCheckedChange={(newStatus) =>
											handleStatusChange(
												product._id,
												newStatus
											)
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
			</div>
			{selectedProduct && (
				<UpdateProduct
					productData={selectedProduct}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					productId={selectedProduct._id}
					onUpdate={getData}
				/>
			)}
		</TooltipProvider>
	);
};

export default ProductsList;
