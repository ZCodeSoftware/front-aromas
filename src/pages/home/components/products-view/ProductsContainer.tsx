import { useState, useEffect } from 'react';
import ProductsList from './ProductsList';
import type { IProduct } from '@/services/products/models/products.interface';
import { productsGetService } from '@/services/products/GET/products.service.get';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { ProductFilterModal } from './ProductsFilterModal';
import type { IFilterOptions } from './models/product-filter.interface';

const ProductsContainer = () => {
	const [products, setProducts] = useState<IProduct>({
		data: [],
		pagination: {
			currentPage: 0,
			totalPages: 0,
			totalItems: 0,
			itemsPerPage: 0,
			hasNextPage: false,
			hasPrevPage: false,
		},
	});
	const [isLoading, setIsLoading] = useState(true);

	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [filters, setFilters] = useState<Partial<IFilterOptions>>({
		page: 1,
		limit: 12,
	});

	if (typeof window !== 'undefined') {
		document.body.style.overflow = isFilterModalOpen ? 'hidden' : 'auto';
	}

	const fetchProducts = async (currentFilters: Partial<IFilterOptions>) => {
		setIsLoading(true);
		try {
			const processedParams = Object.entries(currentFilters).reduce(
				(
					acc: { [key: string]: string | number | boolean },
					[key, value]
				) => {
					if (value === null || value === undefined || value === '') {
						return acc;
					}
					if (Array.isArray(value)) {
						if (value.length > 0) {
							acc[key] = JSON.stringify(value);
						}
						return acc;
					}
					acc[key] = value;
					return acc;
				},
				{}
			);

			const response = await productsGetService.getProducts(
				processedParams
			);
			setProducts({
				data: response.data,
				pagination: {
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					totalItems: response.pagination.totalItems,
					itemsPerPage: response.pagination.itemsPerPage,
					hasNextPage: response.pagination.hasNextPage,
					hasPrevPage: response.pagination.hasPrevPage,
				},
			});
		} catch (error) {
			console.error('Error fetching products:', error);
			setProducts({
				data: [],
				pagination: {
					currentPage: 0,
					totalPages: 0,
					totalItems: 0,
					itemsPerPage: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts(filters);
	}, [filters]);

	const handleApplyFilters = (newFilters: Partial<IFilterOptions>) => {
		setFilters({ ...filters, ...newFilters, page: 1 });
	};

	const handleClearFilters = () => {
		const defaultFilters = { page: 1, limit: 12 };
		setFilters(defaultFilters);
	};

	return (
		<div className='xl:w-4/5 flex flex-col items-center mx-auto p-6 shadow-none bg-white'>
			<div className='w-full max-w-6xl'>
				<div className='flex justify-between items-center w-full mb-6 '>
					<h1 className='text-2xl text-center font-bold'>
						Nuestros productos
					</h1>
					<Button
						onClick={() => setIsFilterModalOpen(true)}
						className='border border-gray-300 shadow-md rounded-xl hover:border-fucsia hover:cursor-pointer transition-colors flex items-center gap-2'>
						<Filter className='h-5 w-5 text-fucsia' />
						<span className='hidden sm:inline'>Filtrar</span>
					</Button>
				</div>
				<div className='w-full md:block flex justify-center'>
					{isLoading ? (
						<div className='text-center py-10'>
							Cargando productos...
						</div>
					) : products.data.length > 0 ? (
						<ProductsList products={products.data} />
					) : (
						<div className='text-center py-10'>
							No se encontraron productos.
						</div>
					)}
				</div>
			</div>

			<ProductFilterModal
				isOpen={isFilterModalOpen}
				onClose={() => setIsFilterModalOpen(false)}
				onApplyFilters={handleApplyFilters}
				onClearFilters={handleClearFilters}
				initialFilters={filters}
			/>
		</div>
	);
};

export default ProductsContainer;
