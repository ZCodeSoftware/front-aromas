import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
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
import type { IRole } from '@/services/catalogs/role/models/role.interface';
import { roleGetService } from '@/services/catalogs/role/GET/role.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateRole from '../updateCatalogs/UpdateRole';
import CreateRoleDialog from '../createCatalogs/CreateRoleDialog';

const RolesList = () => {
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedRole, setSelectedRole] = useState<IRole | null>(null);

	const {
		items: rolesData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IRole>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<IRole>('cat-role')
				: roleGetService.getRoles(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-role', id, isActive),
		loadErrorMessage: 'No se pudieron cargar los roles.',
		toggleErrorMessage: 'No se pudo actualizar el estado del rol.',
	});

	const handleEditClick = (role: IRole) => {
		setSelectedRole(role);
		setOpenUpdateModal(true);
	};

	return (
		<>
			<div className='w-full p-4'>
				<div className='w-full flex justify-between items-center mb-4'>
					<Button
						onClick={() => setOpenCreateModal(true)}
						data-tutorial='role-create'
						className='bg-aromas_pink text-aromas_gray_text'>
						<Plus className='mr-2 h-4 w-4' />
						Crear
					</Button>
					<ShowInactiveToggle
						checked={showInactive}
						onCheckedChange={setShowInactive}
					/>
				</div>
				{loading ? (
					<TableSkeleton />
				) : (
					<Table data-tutorial='roles-table'>
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
							{rolesData.map((role) => (
								<TableRow
									key={role._id}
									className={role.isActive ? '' : 'opacity-50'}>
									<TableCell className='font-medium'>
										{role.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={role.isActive}
											disabled={togglingId === role._id}
											onCheckedChange={() =>
												toggleActive(role)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => handleEditClick(role)}>
											<Pencil className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedRole && (
				<UpdateRole
					data={selectedRole}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedRole._id}
					onUpdate={refresh}
				/>
			)}
			<CreateRoleDialog
				open={openCreateModal}
				setOpen={setOpenCreateModal}
				onCreated={refresh}
			/>
		</>
	);
};

export default RolesList;
