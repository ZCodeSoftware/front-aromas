import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import type { IUserProfile } from '@/services/user/models/user.interface';
import { userPutService } from '@/services/user/PUT/user.service.put';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';

interface ProfileConfigProps {
	profile: IUserProfile | null;
	loading: boolean;
	error: boolean;
	onUpdated: () => void;
}

const ProfileConfig: React.FC<ProfileConfigProps> = ({
	profile,
	loading,
	error,
	onUpdated,
}) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		newsletter: false,
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!profile) return;

		setFormData({
			firstName: profile.firstName ?? '',
			lastName: profile.lastName ?? '',
			email: profile.email,
			phone: profile.phone ?? '',
			newsletter: profile.newsletter,
		});
	}, [profile]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (!profile) return;

		if (!formData.email) {
			toast.error('El email no puede quedar vacío.');
			return;
		}

		setSaving(true);
		try {
			await userPutService.updateMyProfile({
				firstName: formData.firstName || undefined,
				lastName: formData.lastName || undefined,
				phone: formData.phone || undefined,
				email: formData.email,
				newsletter: formData.newsletter,
			});
			toast.success('Datos actualizados con éxito.');
			onUpdated();
		} catch (error) {
			toast.error(
				getApiErrorMessage(
					error,
					'No se pudieron actualizar tus datos.',
				),
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className='flex w-full justify-center items-center px-6 py-10 text-aromas_gray_text'>
				Cargando tus datos...
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className='flex w-full justify-center items-center px-6 py-10 text-sm text-red-600'>
				No pudimos cargar tu información. Intenta nuevamente más tarde.
			</div>
		);
	}

	return (
		<div className='flex flex-col w-full px-6 pb-6'>
			<div className='flex py-6 flex-col w-full gap-y-6'>
				<div className='flex gap-x-2'>
					<div className='w-1/2'>
						<label className='text-sm text-aromas_gray_text'>
							Nombre
						</label>
						<Input
							style={{ outline: 'none', boxShadow: 'none' }}
							name='firstName'
							value={formData.firstName}
							onChange={handleInputChange}
						/>
					</div>
					<div className='w-1/2'>
						<label className='text-sm text-aromas_gray_text'>
							Apellido
						</label>
						<Input
							style={{ outline: 'none', boxShadow: 'none' }}
							name='lastName'
							value={formData.lastName}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Email
					</label>
					<Input
						style={{ outline: 'none', boxShadow: 'none' }}
						name='email'
						type='email'
						value={formData.email}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Teléfono
					</label>
					<Input
						style={{ outline: 'none', boxShadow: 'none' }}
						name='phone'
						value={formData.phone}
						onChange={handleInputChange}
					/>
				</div>
				<div className='flex items-center justify-between'>
					<label className='text-sm text-aromas_gray_text'>
						Recibir novedades por email
					</label>
					<Switch
						className='bg-aromas_pink'
						checked={formData.newsletter}
						onCheckedChange={(checked) =>
							setFormData((prev) => ({
								...prev,
								newsletter: checked,
							}))
						}
					/>
				</div>
			</div>
			<div className='flex justify-center'>
				<Button
					onClick={handleSave}
					disabled={saving}
					className='bg-aromas_pink px-6 rounded-3xl text-aromas_gray_text'>
					<Save className='mr-2' />{' '}
					{saving ? 'Guardando...' : 'Guardar cambios'}
				</Button>
			</div>
		</div>
	);
};

export default ProfileConfig;
