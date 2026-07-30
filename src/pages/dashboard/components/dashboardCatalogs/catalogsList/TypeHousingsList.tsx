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
import type { ITypeHousing } from '@/services/catalogs/type-housing/models/type-housing.interface';
import { typeHousingGetService } from '@/services/catalogs/type-housing/GET/type-housing.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateTypeHousing from '../updateCatalogs/UpdateTypeHousing';

const TypeHousingsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedTypeHousing, setSelectedTypeHousing] =
		useState<ITypeHousing | null>(null);

	const {
		items: typeHousingsData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<ITypeHousing>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<ITypeHousing>('cat-type-housing')
				: typeHousingGetService.getTypeHousings(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-type-housing', id, isActive),
		loadErrorMessage: 'No se pudieron cargar los tipos de vivienda.',
		toggleErrorMessage:
			'No se pudo actualizar el estado del tipo de vivienda.',
	});

	const handleEditClick = (typeHousing: ITypeHousing) => {
		setSelectedTypeHousing(typeHousing);
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
							{typeHousingsData.map((typeHousing) => (
								<TableRow
									key={typeHousing._id}
									className={
										typeHousing.isActive ? '' : 'opacity-50'
									}>
									<TableCell className='font-medium'>
										{typeHousing.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={typeHousing.isActive}
											disabled={
												togglingId === typeHousing._id
											}
											onCheckedChange={() =>
												toggleActive(typeHousing)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												handleEditClick(typeHousing)
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
			{selectedTypeHousing && (
				<UpdateTypeHousing
					data={selectedTypeHousing}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedTypeHousing._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default TypeHousingsList;
