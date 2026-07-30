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
import type { IAssociatedEmotion } from '@/services/catalogs/associated-emotions/models/associated-emotion.interface';
import { associatedEmotionsGetService } from '@/services/catalogs/associated-emotions/GET/associated-emotions.service';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateAssociatedEmotion from '../updateCatalogs/UpdateAssociatedEmotion';

const AssociatedEmotionsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedAssociatedEmotion, setSelectedAssociatedEmotion] =
		useState<IAssociatedEmotion | null>(null);

	const {
		items: associatedEmotionsData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IAssociatedEmotion>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<IAssociatedEmotion>(
						'cat-associated-emotion'
				  )
				: associatedEmotionsGetService.getAssociatedEmotions(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-associated-emotion', id, isActive),
		loadErrorMessage: 'No se pudieron cargar las emociones.',
		toggleErrorMessage: 'No se pudo actualizar el estado de la emoción.',
	});

	const handleEditClick = (associatedEmotion: IAssociatedEmotion) => {
		setSelectedAssociatedEmotion(associatedEmotion);
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
							{associatedEmotionsData.map((associatedEmotion) => (
								<TableRow
									key={associatedEmotion._id}
									className={
										associatedEmotion.isActive
											? ''
											: 'opacity-50'
									}>
									<TableCell className='font-medium'>
										{associatedEmotion.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={associatedEmotion.isActive}
											disabled={
												togglingId ===
												associatedEmotion._id
											}
											onCheckedChange={() =>
												toggleActive(associatedEmotion)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												handleEditClick(associatedEmotion)
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
			{selectedAssociatedEmotion && (
				<UpdateAssociatedEmotion
					data={selectedAssociatedEmotion}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedAssociatedEmotion._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default AssociatedEmotionsList;
