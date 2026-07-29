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
import { Switch } from '@/components/ui/switch';
import TableSkeleton from '../../TableSkeleton';
import type { IUserProfile } from '@/services/user/models/user.interface';
import { userGetService } from '@/services/user/GET/user.service.get';
import { userPutService } from '@/services/user/PUT/user.service.put';
import { userDeleteService } from '@/services/user/DELETE/user.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import UpdateUser from '../updateUser/UpdateUser';

const UsersList = () => {
	const [loading, setLoading] = useState(true);
	const [usersData, setUsersData] = useState<IUserProfile[]>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [togglingId, setTogglingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await userGetService.getAllUsers();
			if (result) {
				setUsersData(result);
			}
		} catch (error) {
			console.error('Error fetching users:', error);
			toast.error(getApiErrorMessage(error, 'No se pudieron cargar los usuarios.'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (user: IUserProfile) => {
		setSelectedUser(user);
		setOpenUpdateModal(true);
	};

	const handleDelete = async (user: IUserProfile) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar a "${user.email}"?`
		);
		if (!confirmed) return;

		setDeletingId(user._id);
		try {
			await userDeleteService.deleteUser(user._id);
			toast.success('Usuario eliminado con éxito.');
			getData();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo eliminar el usuario.')
			);
		} finally {
			setDeletingId(null);
		}
	};

	const handleToggleActive = async (user: IUserProfile) => {
		setTogglingId(user._id);
		try {
			await userPutService.updateUserAsAdmin(user._id, {
				isActive: !user.isActive,
			});
			setUsersData((prev) =>
				prev.map((u) =>
					u._id === user._id ? { ...u, isActive: !u.isActive } : u
				)
			);
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo actualizar el estado.')
			);
		} finally {
			setTogglingId(null);
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
							<TableHead>Email</TableHead>
							<TableHead>Nombre</TableHead>
							<TableHead>Apellido</TableHead>
							<TableHead>Teléfono</TableHead>
							<TableHead>Roles</TableHead>
							<TableHead className='text-center'>Estado</TableHead>
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{usersData.map((user) => (
							<TableRow key={user._id}>
								<TableCell className='font-medium'>
									{user.email}
								</TableCell>
								<TableCell>{user.firstName || '-'}</TableCell>
								<TableCell>{user.lastName || '-'}</TableCell>
								<TableCell>{user.phone || '-'}</TableCell>
								<TableCell>
									{user.roles.map((role) => role.name).join(', ')}
								</TableCell>
								<TableCell className='text-center'>
									<Switch
										checked={user.isActive}
										disabled={togglingId === user._id}
										onCheckedChange={() =>
											handleToggleActive(user)
										}
									/>
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => handleEditClick(user)}>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										disabled={deletingId === user._id}
										onClick={() => handleDelete(user)}>
										<Trash2 className='h-4 w-4 text-red-600' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedUser && (
				<UpdateUser
					data={selectedUser}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedUser._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default UsersList;
