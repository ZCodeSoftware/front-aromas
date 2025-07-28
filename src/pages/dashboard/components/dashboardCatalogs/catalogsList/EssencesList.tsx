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
import TableSkeleton from '../../TableSkeleton';
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import { essencesGetService } from '@/services/catalogs/essences/GET/essences.service.get';
import UpdateEssence from '../updateCatalogs/UpdateEssence';

const EssencesList = () => {
	const [loading, setLoading] = useState(true);
	const [essencesData, setEssencesData] = useState<IEssence[]>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedEssence, setSelectedEssence] = useState<IEssence | null>(
		null
	);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await essencesGetService.getEssences();
			if (result) {
				setEssencesData(result);
			}
		} catch (error) {
			console.error('Error fetching brands:', error);
			toast.error('No se pudieron cargar las marcas.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (essence: IEssence) => {
		setSelectedEssence(essence);
		setOpenUpdateModal(true);
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
						{essencesData.map((essences) => (
							<TableRow key={essences._id}>
								<TableCell className='font-medium'>
									{essences.name}
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
			</div>
			{selectedEssence && (
				<UpdateEssence
					data={selectedEssence}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedEssence._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default EssencesList;
