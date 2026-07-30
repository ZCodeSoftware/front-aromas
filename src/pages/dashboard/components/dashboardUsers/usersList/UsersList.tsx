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
import type { IUserProfile } from '@/services/user/models/user.interface';
import { userGetService } from '@/services/user/GET/user.service.get';
import { userPutService } from '@/services/user/PUT/user.service.put';
import UpdateUser from '../updateUser/UpdateUser';

const UsersList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);

	const {
		items: usersData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IUserProfile>({
		fetchItems: (includeInactive) =>
			includeInactive
				? userGetService.getAllUsersIncludingInactive()
				: userGetService.getAllUsers(),
		setItemActive: async (id, isActive) => {
			await userPutService.updateUserAsAdmin(id, { isActive });
		},
		loadErrorMessage: 'No se pudieron cargar los usuarios.',
		toggleErrorMessage: 'No se pudo actualizar el estado del usuario.',
	});

	const handleEditClick = (user: IUserProfile) => {
		setSelectedUser(user);
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
					<Table data-tutorial='users-table'>
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
								<TableRow
									key={user._id}
									className={user.isActive ? '' : 'opacity-50'}>
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
											onCheckedChange={() => toggleActive(user)}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => handleEditClick(user)}>
											<Pencil className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedUser && (
				<UpdateUser
					data={selectedUser}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedUser._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default UsersList;
