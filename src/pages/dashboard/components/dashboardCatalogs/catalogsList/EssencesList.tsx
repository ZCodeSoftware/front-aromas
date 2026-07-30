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
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import { essencesGetService } from '@/services/catalogs/essences/GET/essences.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateEssence from '../updateCatalogs/UpdateEssence';

const EssencesList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedEssence, setSelectedEssence] = useState<IEssence | null>(
		null
	);

	const {
		items: essencesData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IEssence>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<IEssence>('cat-essence')
				: essencesGetService.getEssences(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-essence', id, isActive),
		loadErrorMessage: 'No se pudieron cargar las esencias.',
		toggleErrorMessage: 'No se pudo actualizar el estado de la esencia.',
	});

	const handleEditClick = (essence: IEssence) => {
		setSelectedEssence(essence);
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
							{essencesData.map((essences) => (
								<TableRow
									key={essences._id}
									className={essences.isActive ? '' : 'opacity-50'}>
									<TableCell className='font-medium'>
										{essences.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={essences.isActive}
											disabled={togglingId === essences._id}
											onCheckedChange={() =>
												toggleActive(essences)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												handleEditClick(essences)
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
			{selectedEssence && (
				<UpdateEssence
					data={selectedEssence}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedEssence._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default EssencesList;
