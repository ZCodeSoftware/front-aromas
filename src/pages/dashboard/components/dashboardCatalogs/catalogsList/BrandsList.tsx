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
import type { IBrand } from '@/services/catalogs/brand/models/brands.interface';
import { brandsGetService } from '@/services/catalogs/brand/GET/brands.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateBrand from '../updateCatalogs/UpdateBrand';

const BrandsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

	const {
		items: brandsData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IBrand>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<IBrand>('cat-brand')
				: brandsGetService.getBrands(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-brand', id, isActive),
		loadErrorMessage: 'No se pudieron cargar las marcas.',
		toggleErrorMessage: 'No se pudo actualizar el estado de la marca.',
	});

	const handleEditClick = (brand: IBrand) => {
		setSelectedBrand(brand);
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
							{brandsData.map((brands) => (
								<TableRow
									key={brands._id}
									className={brands.isActive ? '' : 'opacity-50'}>
									<TableCell className='font-medium'>
										{brands.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={brands.isActive}
											disabled={togglingId === brands._id}
											onCheckedChange={() =>
												toggleActive(brands)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => handleEditClick(brands)}>
											<Pencil className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedBrand && (
				<UpdateBrand
					data={selectedBrand}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedBrand._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default BrandsList;
