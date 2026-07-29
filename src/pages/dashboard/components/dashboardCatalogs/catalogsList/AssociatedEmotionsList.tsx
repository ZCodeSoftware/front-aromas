import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TableSkeleton from '../../TableSkeleton';
import type { IAssociatedEmotion } from '@/services/catalogs/associated-emotions/models/associated-emotion.interface';
import { associatedEmotionsGetService } from '@/services/catalogs/associated-emotions/GET/associated-emotions.service';
import { associatedEmotionsDeleteService } from '@/services/catalogs/associated-emotions/DELETE/associated-emotions.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import UpdateAssociatedEmotion from '../updateCatalogs/UpdateAssociatedEmotion';

const AssociatedEmotionsList = () => {
	const [loading, setLoading] = useState(true);
	const [associatedEmotionsData, setAssociatedEmotionsData] = useState<
		IAssociatedEmotion[]
	>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedAssociatedEmotion, setSelectedAssociatedEmotion] =
		useState<IAssociatedEmotion | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result =
				await associatedEmotionsGetService.getAssociatedEmotions();
			if (result) {
				setAssociatedEmotionsData(result);
			}
		} catch (error) {
			console.error('Error fetching associated emotions:', error);
			toast.error('No se pudieron cargar las emociones.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (associatedEmotion: IAssociatedEmotion) => {
		setSelectedAssociatedEmotion(associatedEmotion);
		setOpenUpdateModal(true);
	};

	const handleDelete = async (associatedEmotion: IAssociatedEmotion) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar "${associatedEmotion.name}"?`
		);
		if (!confirmed) return;

		setDeletingId(associatedEmotion._id);
		try {
			await associatedEmotionsDeleteService.deleteAssociatedEmotion(
				associatedEmotion._id
			);
			toast.success('Emoción eliminada con éxito.');
			getData();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo eliminar la emoción.')
			);
		} finally {
			setDeletingId(null);
		}
	};

	if (loading) {
		return <TableSkeleton />;
	}

	return (
		<>
			<div className='w-full p-4'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{associatedEmotionsData.map((associatedEmotions) => (
							<TableRow key={associatedEmotions._id}>
								<TableCell className='font-medium'>
									{associatedEmotions.name}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleEditClick(associatedEmotions)
										}>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										disabled={
											deletingId ===
											associatedEmotions._id
										}
										onClick={() =>
											handleDelete(associatedEmotions)
										}>
										<Trash2 className='h-4 w-4 text-red-600' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedAssociatedEmotion && (
				<UpdateAssociatedEmotion
					data={selectedAssociatedEmotion}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedAssociatedEmotion._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default AssociatedEmotionsList;
