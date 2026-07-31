import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { combosGetService } from '@/services/combos/GET/combos.service.get';
import { productsGetService } from '@/services/products/GET/products.service.get';
import { useStorefrontStore } from '@/stores/storefront.store';
import ProductsList from './ProductsList';
import ProductsPagination from './ProductsPagination';
import { ProductFilterModal } from './ProductsFilterModal';
import type { IFilterOptions } from './models/product-filter.interface';
import type {
	IStoreCard,
	StoreCardFilter,
} from './models/store-card.interface';

/** Query params: nulls dropped, arrays serialised the way the API expects them. */
const toParams = (filters: Partial<IFilterOptions>) =>
	Object.entries(filters).reduce(
		(acc: { [key: string]: string | number | boolean }, [key, value]) => {
			if (value === null || value === undefined || value === '') return acc;

			if (Array.isArray(value)) {
				if (value.length > 0) acc[key] = JSON.stringify(value);
				return acc;
			}

			acc[key] = value;
			return acc;
		},
		{}
	);

const KIND_TABS: { value: StoreCardFilter; label: string }[] = [
	{ value: 'all', label: 'Todo' },
	{ value: 'products', label: 'Productos' },
	{ value: 'combos', label: 'Combos' },
];

const PAGE_SIZE = 12;

const ProductsContainer = () => {
	const [cards, setCards] = useState<IStoreCard[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);

	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [filters, setFilters] = useState<Partial<IFilterOptions>>({
		limit: PAGE_SIZE,
	});

	// Set from the navbar, which has no route to navigate to in a single-route SPA.
	const navCategoryId = useStorefrontStore((state) => state.categoryId);
	const navCategoryName = useStorefrontStore((state) => state.categoryName);
	const clearNavCategory = useStorefrontStore((state) => state.clearCategory);
	// Shared with the navbar too, so "Productos" and "Combos" up there and the tabs
	// below always agree on what is being shown.
	const kind = useStorefrontStore((state) => state.kind);
	const setKind = useStorefrontStore((state) => state.selectKind);

	if (typeof window !== 'undefined') {
		document.body.style.overflow = isFilterModalOpen ? 'hidden' : 'auto';
	}

	// Any change to what is being asked for sends the shopper back to page 1,
	// otherwise a narrower result set can leave them stranded on an empty page.
	useEffect(() => {
		setPage(1);
	}, [filters, kind, navCategoryId]);

	useEffect(() => {
		const fetchCards = async () => {
			setIsLoading(true);
			try {
				// The navbar category wins over the modal's, and only one of the two
				// is ever active: applying filters clears the navbar selection.
				const params = toParams({
					...filters,
					page,
					...(navCategoryId ? { categoryId: [navCategoryId] } : {}),
				});

				/**
				 * Combos only load on page 1 of the mixed view. Products and combos
				 * are paginated independently by the API, so "page 2" of each is
				 * unrelated — repeating the same handful of combos on every page
				 * would be both noise and a lie about how many there are. The combo
				 * tab paginates them properly.
				 */
				const wantsCombos =
					kind === 'combos' || (kind === 'all' && page === 1);

				const [products, combos] = await Promise.all([
					kind === 'combos'
						? null
						: productsGetService.getProducts(params),
					wantsCombos
						? combosGetService.getCombos({
								// Combos have no category of their own, so the
								// catalogue filters do not apply to them.
								page: kind === 'combos' ? page : 1,
								limit: PAGE_SIZE,
								search: filters.search,
								hasStock: true,
							})
						: null,
				]);

				// Combos first: they are the offer worth leading with, and a shopper
				// after a single product can still use the tabs or the filters.
				setCards([
					...(combos?.data ?? []).map(
						(combo): IStoreCard => ({ kind: 'combo', data: combo })
					),
					...(products?.data ?? []).map(
						(product): IStoreCard => ({ kind: 'product', data: product })
					),
				]);

				// Page count follows whichever collection is being paged through.
				setTotalPages(
					kind === 'combos'
						? (combos?.pagination.totalPages ?? 0)
						: (products?.pagination.totalPages ?? 0)
				);
			} catch (error) {
				console.error('Error fetching the storefront grid:', error);
				setCards([]);
				setTotalPages(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCards();
	}, [filters, kind, page, navCategoryId]);

	const handleApplyFilters = (newFilters: Partial<IFilterOptions>) => {
		// The modal takes over the category, so the two never disagree about which
		// one is in force.
		if (newFilters.categoryId?.length) clearNavCategory();
		setFilters({ ...filters, ...newFilters });
	};

	const handleClearFilters = () => {
		setFilters({ limit: PAGE_SIZE });
		setKind('all');
		clearNavCategory();
	};

	const handlePageChange = (nextPage: number) => {
		setPage(nextPage);
		document
			.getElementById('products-section')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<div className='xl:w-4/5 min-h-screen flex flex-col items-center mx-auto px-6 shadow-none bg-aromas_home_bg'>
			<div className='w-full max-w-6xl'>
				<div className='flex justify-between items-center w-full mb-6 '>
					<h1 className='text-2xl text-center font-bold text-aromas_gray_text'>
						Nuestros productos
					</h1>
					<div className='flex items-center gap-2'>
						<div
							className='flex items-center rounded-xl border border-gray-300 p-0.5'
							role='group'
							aria-label='Mostrar productos o combos'>
							{KIND_TABS.map((tab) => (
								<button
									key={tab.value}
									type='button'
									aria-pressed={kind === tab.value}
									onClick={() => setKind(tab.value)}
									className={`rounded-lg px-3 py-1.5 text-sm transition-colors hover:cursor-pointer ${
										kind === tab.value
											? 'bg-aromas_pink font-bold text-aromas_gray_text'
											: 'text-aromas_gray_text hover:bg-aromas_pink/20'
									}`}>
									{tab.label}
								</button>
							))}
						</div>
						<Button
							onClick={() => setIsFilterModalOpen(true)}
							className='border border-gray-300 text-aromas_gray_text shadow-md rounded-xl hover:border-aromas_fucsia hover:cursor-pointer transition-colors flex items-center gap-2'>
							<Filter className='h-5 w-5 text-aromas_fucsia' />
							<span className='hidden sm:inline'>Filtrar</span>
						</Button>
					</div>
				</div>

				{navCategoryName && (
					// Without this chip the grid would be silently narrowed by a
					// click made higher up the page, with no way back to the rest.
					<div className='mb-4 flex items-center gap-2'>
						<span className='text-sm text-aromas_gray_text'>
							Filtrando por:
						</span>
						<button
							type='button'
							onClick={clearNavCategory}
							className='flex items-center gap-1 rounded-full bg-aromas_pink px-3 py-1 text-sm font-medium text-aromas_gray_text hover:cursor-pointer'>
							{navCategoryName}
							<X className='h-3.5 w-3.5' />
						</button>
					</div>
				)}

				<div className='w-full md:block flex justify-center'>
					{isLoading ? (
						<div className='text-center py-10 text-aromas_gray_text'>
							Cargando productos...
						</div>
					) : cards.length > 0 ? (
						<ProductsList cards={cards} />
					) : (
						<div className='text-center py-10 text-aromas_gray_text'>
							No se encontraron productos.
						</div>
					)}
				</div>

				{!isLoading && (
					<ProductsPagination
						currentPage={page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				)}
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
