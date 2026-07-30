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
import TableSkeleton from '../../TableSkeleton';
import ShowInactiveToggle from '../../ShowInactiveToggle';
import { useActiveRecordsList } from '@/pages/dashboard/hooks/useActiveRecordsList';
import { subCategoriesGetService } from '@/services/catalogs/sub-categories/GET/sub-categories.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';
import UpdateSubCategory from '../updateCatalogs/UpdateSubCategory';

const SubCategoriesList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedSubCategory, setSelectedSubCategory] =
		useState<ISubCategory | null>(null);

	const {
		items: subCategoriesData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<ISubCategory>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<ISubCategory>('cat-sub-category')
				: subCategoriesGetService.getSubCategories(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-sub-category', id, isActive),
		loadErrorMessage: 'No se pudieron cargar las sub-categorías.',
		toggleErrorMessage:
			'No se pudo actualizar el estado de la sub-categoría.',
	});

	const handleEditClick = (subCategory: ISubCategory) => {
		setSelectedSubCategory(subCategory);
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
								<TableHead className='text-center'>Estado</TableHead>
								<TableHead className='text-right'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{subCategoriesData.map((subCategories) => (
								<TableRow
									key={subCategories._id}
									className={
										subCategories.isActive ? '' : 'opacity-50'
									}>
									<TableCell className='font-medium'>
										{subCategories.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={subCategories.isActive}
											disabled={
												togglingId === subCategories._id
											}
											onCheckedChange={() =>
												toggleActive(subCategories)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												handleEditClick(subCategories)
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
			{selectedSubCategory && (
				<UpdateSubCategory
					data={selectedSubCategory}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedSubCategory._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default SubCategoriesList;
