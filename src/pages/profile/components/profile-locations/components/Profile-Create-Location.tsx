import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';
import type { IProfileLocationsSubpagesProps } from '../models/profile-locations-subpages-props.interface';
import MapSelector from '@/components/map/MapSelector';
import { LatLng } from 'leaflet';
import { Textarea } from '@/components/ui/textarea';
import { addressPostService } from '@/services/address/POST/address.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import { typeHousingGetService } from '@/services/catalogs/type-housing/GET/type-housing.service.get';
import type { ITypeHousing } from '@/services/catalogs/type-housing/models/type-housing.interface';

const NO_TYPE_HOUSING = 'none';

interface ProfileCreateLocationProps extends IProfileLocationsSubpagesProps {
	onCreated: () => void;
}

const ProfileCreateLocation: React.FC<ProfileCreateLocationProps> = ({
	onNavigate,
	onCreated,
}) => {
	const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(
		null
	);
	const [formData, setFormData] = useState({
		name: '',
		street: '',
		floor_address: '',
		number: '',
		zip_code: '',
		description: '',
		type_of_housing: NO_TYPE_HOUSING,
	});
	const [typeHousings, setTypeHousings] = useState<ITypeHousing[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		typeHousingGetService
			.getTypeHousings()
			.then(setTypeHousings)
			.catch(() => setTypeHousings([]));
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSaveLocation = async () => {
		if (!formData.street || !formData.zip_code) {
			toast.error('Completa al menos la calle y el código postal.');
			return;
		}

		setSaving(true);
		try {
			await addressPostService.createAddress({
				name: formData.name || undefined,
				street: formData.street,
				number: formData.number ? Number(formData.number) : undefined,
				zipCode: formData.zip_code,
				description: formData.description || undefined,
				floorAddress: formData.floor_address || undefined,
				isActive: true,
				typeOfHousing:
					formData.type_of_housing !== NO_TYPE_HOUSING
						? formData.type_of_housing
						: undefined,
				geo: selectedPosition
					? {
							lat: selectedPosition.lat.toString(),
							lng: selectedPosition.lng.toString(),
						}
					: undefined,
			});
			toast.success('Dirección creada con éxito.');
			onCreated();
			onNavigate('addresses');
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo crear la dirección.')
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className='flex flex-col w-full px-6 pb-6'>
			<div className='flex py-6 flex-col w-full gap-y-6'>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Nombre
					</label>
					<Input
						style={{ outline: 'none', boxShadow: 'none' }}
						name='name'
						value={formData.name}
						onChange={handleInputChange}
					/>
				</div>
				<div className='flex gap-x-2'>
					<div className='w-4/5'>
						<label className='text-sm text-aromas_gray_text'>
							Calle
						</label>
						<Input
							style={{ outline: 'none', boxShadow: 'none' }}
							name='street'
							value={formData.street}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label className='text-sm text-aromas_gray_text'>
							Número
						</label>
						<Input
							style={{ outline: 'none', boxShadow: 'none' }}
							name='number'
							value={formData.number}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Piso / Departamento
					</label>
					<Input
						style={{ outline: 'none', boxShadow: 'none' }}
						name='floor_address'
						value={formData.floor_address}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Código postal
					</label>
					<Input
						style={{ outline: 'none', boxShadow: 'none' }}
						name='zip_code'
						value={formData.zip_code}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Descripción
					</label>
					<Textarea
						style={{ outline: 'none', boxShadow: 'none' }}
						name='description'
						value={formData.description}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Tipo de vivienda
					</label>
					<Select
						value={formData.type_of_housing}
						onValueChange={(value) =>
							setFormData((prev) => ({
								...prev,
								type_of_housing: value,
							}))
						}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Seleccioná un tipo' />
						</SelectTrigger>
						<SelectContent className='bg-white'>
							<SelectItem value={NO_TYPE_HOUSING}>
								Sin especificar
							</SelectItem>
							{typeHousings.map((typeHousing) => (
								<SelectItem
									key={typeHousing._id}
									value={typeHousing._id}>
									{typeHousing.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<MapSelector
						selectedPosition={selectedPosition}
						onPositionChange={setSelectedPosition}
					/>
				</div>
			</div>
			<div className='flex justify-center gap-x-4'>
				<Button
					onClick={() => onNavigate('addresses')}
					variant='outline'
					className='border-aromas_fucsia text-aromas_fucsia rounded-3xl'>
					Cancelar
				</Button>
				<Button
					onClick={handleSaveLocation}
					disabled={saving}
					className='bg-aromas_pink px-6 rounded-3xl text-aromas_gray_text'>
					<Save className='mr-2' />{' '}
					{saving ? 'Guardando...' : 'Guardar'}
				</Button>
			</div>
		</div>
	);
};

export default ProfileCreateLocation;
