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
import type { IRole } from '@/services/catalogs/role/models/role.interface';
import { roleGetService } from '@/services/catalogs/role/GET/role.service.get';
import { roleDeleteService } from '@/services/catalogs/role/DELETE/role.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import UpdateRole from '../updateCatalogs/UpdateRole';
import CreateRoleDialog from '../createCatalogs/CreateRoleDialog';

const RolesList = () => {
	const [loading, setLoading] = useState(true);
	const [rolesData, setRolesData] = useState<IRole[]>([]);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await roleGetService.getRoles();
			if (result) {
				setRolesData(result);
			}
		} catch (error) {
			console.error('Error fetching roles:', error);
			toast.error('No se pudieron cargar los roles.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (role: IRole) => {
		setSelectedRole(role);
		setOpenUpdateModal(true);
	};

	const handleDelete = async (role: IRole) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar "${role.name}"?`
		);
		if (!confirmed) return;

		setDeletingId(role._id);
		try {
			await roleDeleteService.deleteRole(role._id);
			toast.success('Rol eliminado con éxito.');
			await getData();
		} catch (error) {
			toast.error(getApiErrorMessage(error, 'No se pudo eliminar el rol.'));
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
						{rolesData.map((role) => (
							<TableRow key={role._id}>
								<TableCell className='font-medium'>
									{role.name}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => handleEditClick(role)}>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => handleDelete(role)}
										disabled={deletingId === role._id}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedRole && (
				<UpdateRole
					data={selectedRole}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedRole._id}
					onUpdate={getData}
				/>
			)}
			<CreateRoleDialog
				open={openCreateModal}
				setOpen={setOpenCreateModal}
				onCreated={getData}
			/>
		</>
	);
};

export default RolesList;
