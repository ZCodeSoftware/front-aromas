import React, { useEffect, useState } from 'react';
import type { IUpdateUserProps } from './models/update-user-props.interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import type { IAdminUpdateUserPayload } from '@/services/user/models/admin-update-user-payload.interface';
import { userPutService } from '@/services/user/PUT/user.service.put';
import { roleGetService } from '@/services/catalogs/role/GET/role.service.get';
import type { IRole } from '@/services/catalogs/role/models/role.interface';
import { EMAIL_REGEX } from '@/services/auth/utils/auth-validation';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';

const UpdateUser: React.FC<IUpdateUserProps> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
	const [user, setUser] = useState<IAdminUpdateUserPayload>({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		newsletter: false,
		isActive: true,
		roles: [],
	});
	const [roles, setRoles] = useState<IRole[]>([]);
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		roleGetService
			.getRoles()
			.then(setRoles)
			.catch(() => setRoles([]));
	}, []);

	useEffect(() => {
		if (data) {
			setUser({
				firstName: data.firstName || '',
				lastName: data.lastName || '',
				phone: data.phone || '',
				email: data.email || '',
				newsletter: data.newsletter,
				isActive: data.isActive,
				roles: data.roles.map((role) => role._id),
			});
		}
	}, [data]);

	useEffect(() => {
		let errorMessage = '';
		if (!user.email) {
			errorMessage = 'El email es requerido.';
		} else if (!EMAIL_REGEX.test(user.email)) {
			errorMessage = 'El email no es válido.';
		}
		setError(errorMessage);
	}, [user.email]);

	useEffect(() => {
		setSubmitDisable(!!error || !user.email);
	}, [error, user.email]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleBlur = () => {
		setTouched(true);
	};

	const handleSwitchChange = (name: 'newsletter' | 'isActive') => (
		checked: boolean
	) => {
		setUser((prevUser) => ({
			...prevUser,
			[name]: checked,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setTouched(true);
		if (error) {
			toast.error('Por favor, corrige el error en el formulario.');
			return;
		}
		setButtonLoading(true);
		try {
			await userPutService.updateUserAsAdmin(id, user);
			toast.success('Usuario modificado con éxito.');
			onUpdate();
			setOpenUpdateModal(false);
			setTouched(false);
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'Error al actualizar el usuario.')
			);
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar usuario</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='firstName'>Nombre</label>
						<Input
							name='firstName'
							value={user.firstName}
							onChange={handleChange}
							placeholder='Ej: Juana'
							className='mt-1'
						/>
					</div>

					<div className='grid gap-2'>
						<label htmlFor='lastName'>Apellido</label>
						<Input
							name='lastName'
							value={user.lastName}
							onChange={handleChange}
							placeholder='Ej: Pérez'
							className='mt-1'
						/>
					</div>

					<div className='grid gap-2'>
						<label htmlFor='phone'>Teléfono</label>
						<Input
							name='phone'
							value={user.phone}
							onChange={handleChange}
							placeholder='Ej: +5491122334455'
							className='mt-1'
						/>
					</div>

					<div className='grid gap-2'>
						<label htmlFor='email'>Email</label>
						<Input
							name='email'
							value={user.email}
							onChange={handleChange}
							required
							onBlur={handleBlur}
							placeholder='Ej: usuario@aromas.com'
							className={`mt-1 ${
								touched && error
									? 'border-red-500 focus-visible:ring-red-500'
									: ''
							}`}
						/>
						{touched && error && (
							<p className='text-sm text-red-600 mt-1'>{error}</p>
						)}
					</div>

					<div className='grid gap-2'>
						<label htmlFor='roles'>Roles</label>
						<MultiSelect
							options={roles}
							selected={user.roles ?? []}
							onChange={(selected) =>
								setUser((prevUser) => ({
									...prevUser,
									roles: selected,
								}))
							}
							placeholder='Seleccioná roles...'
						/>
					</div>

					<div className='flex items-center justify-between'>
						<label htmlFor='newsletter'>Suscripto al newsletter</label>
						<Switch
							id='newsletter'
							checked={!!user.newsletter}
							onCheckedChange={handleSwitchChange('newsletter')}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<label htmlFor='isActive'>Usuario activo</label>
						<Switch
							id='isActive'
							checked={!!user.isActive}
							onCheckedChange={handleSwitchChange('isActive')}
						/>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type='button' variant='outline'>
								Cancelar
							</Button>
						</DialogClose>
						<Button
							type='submit'
							disabled={submitDisable || buttonLoading}>
							{buttonLoading && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Guardar cambios
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateUser;
