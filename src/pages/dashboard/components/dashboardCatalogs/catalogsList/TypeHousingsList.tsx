import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { ITypeHousing } from '@/services/catalogs/type-housing/models/type-housing.interface';
import { typeHousingGetService } from '@/services/catalogs/type-housing/GET/type-housing.service.get';
import { typeHousingDeleteService } from '@/services/catalogs/type-housing/DELETE/type-housing.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import UpdateTypeHousing from '../updateCatalogs/UpdateTypeHousing';
import CreateTypeHousingDialog from '../createCatalogs/CreateTypeHousingDialog';

const TypeHousingsList = () => {
	const [loading, setLoading] = useState(true);
	const [typeHousingsData, setTypeHousingsData] = useState<ITypeHousing[]>(
		[]
	);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedTypeHousing, setSelectedTypeHousing] =
		useState<ITypeHousing | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await typeHousingGetService.getTypeHousings();
			if (result) {
				setTypeHousingsData(result);
			}
		} catch (error) {
			console.error('Error fetching type housings:', error);
			toast.error('No se pudieron cargar los tipos de vivienda.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (typeHousing: ITypeHousing) => {
		setSelectedTypeHousing(typeHousing);
		setOpenUpdateModal(true);
	};

	const handleDelete = async (typeHousing: ITypeHousing) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar "${typeHousing.name}"?`
		);
		if (!confirmed) return;

		setDeletingId(typeHousing._id);
		try {
			await typeHousingDeleteService.deleteTypeHousing(
				typeHousing._id
			);
			toast.success('Tipo de vivienda eliminado con éxito.');
			await getData();
		} catch (error) {
			toast.error(
				getApiErrorMessage(
					error,
					'No se pudo eliminar el tipo de vivienda.'
				)
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
				<div className='w-full flex justify-start mb-4'>
					<Button
						onClick={() => setOpenCreateModal(true)}
						className='bg-aromas_pink text-aromas_gray_text'>
						<Plus className='mr-2 h-4 w-4' />
						Crear
					</Button>
				</div>
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
						{typeHousingsData.map((typeHousing) => (
							<TableRow key={typeHousing._id}>
								<TableCell className='font-medium'>
									{typeHousing.name}
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
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleDelete(typeHousing)
										}
										disabled={
											deletingId === typeHousing._id
										}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedTypeHousing && (
				<UpdateTypeHousing
					data={selectedTypeHousing}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedTypeHousing._id}
					onUpdate={getData}
				/>
			)}
			<CreateTypeHousingDialog
				open={openCreateModal}
				setOpen={setOpenCreateModal}
				onCreated={getData}
			/>
		</>
	);
};

export default TypeHousingsList;
