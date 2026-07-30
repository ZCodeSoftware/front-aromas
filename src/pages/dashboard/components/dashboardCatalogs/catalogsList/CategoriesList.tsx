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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ShowInactiveToggle from '../../ShowInactiveToggle';
import { useActiveRecordsList } from '@/pages/dashboard/hooks/useActiveRecordsList';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import { categoriesGetService } from '@/services/catalogs/categories/GET/categories.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateCategory from '../updateCatalogs/UpdateCategory';
import TableSkeleton from '../../TableSkeleton';

const CategoriesList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
		null
	);

	const {
		items: categoriesData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<ICategory>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<ICategory>('cat-category')
				: categoriesGetService.getCategories(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-category', id, isActive),
		loadErrorMessage: 'No se pudieron cargar las categorías.',
		toggleErrorMessage: 'No se pudo actualizar el estado de la categoría.',
	});

	const handleEditClick = (category: ICategory) => {
		setSelectedCategory(category);
		setOpenUpdateModal(true);
	};

	return (
		<>
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
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nombre</TableHead>
								<TableHead className='text-center'>
									Sub-Categorías
								</TableHead>
								<TableHead className='text-center'>Estado</TableHead>
								<TableHead className='text-right'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{categoriesData.map((category) => (
								<TableRow
									key={category._id}
									className={
										category.isActive ? '' : 'opacity-50'
									}>
									<TableCell className='font-medium'>
										{category.name}
									</TableCell>
									<TableCell className='fornt-medium text-center'>
										{category.subCategories &&
										category.subCategories.length > 0 ? (
											<Tooltip delayDuration={200}>
												<TooltipTrigger asChild>
													<div className='flex items-center justify-center'>
														{category.subCategories
															.slice(0, 2)
															.map((sub) => sub.name)
															.join(' , ')}
														{category.subCategories
															.length > 2 && (
															<span className='font-bold'>
																...
															</span>
														)}
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p className='font-medium'>
														{category.subCategories
															.map((sub) => sub.name)
															.join(', ')}
													</p>
												</TooltipContent>
											</Tooltip>
										) : (
											<span className='text-gray-400'>-</span>
										)}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={category.isActive}
											disabled={togglingId === category._id}
											onCheckedChange={() =>
												toggleActive(category)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												handleEditClick(category)
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
			{selectedCategory && (
				<UpdateCategory
					data={selectedCategory}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedCategory._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default CategoriesList;
