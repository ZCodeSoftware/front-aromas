import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type { IProfileLocationsSubpagesProps } from '../models/profile-locations-subpages-props.interface';
import MapSelector from '@/components/map/MapSelector';
import { LatLng } from 'leaflet';
import { Textarea } from '@/components/ui/textarea';

const ProfileCreateLocation: React.FC<IProfileLocationsSubpagesProps> = ({
	onNavigate,
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
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSaveLocation = async () => {
		if (!selectedPosition) {
			alert('Por favor, selecciona una ubicación en el mapa primero.');
			return;
		}
		console.log({
			...formData,
			address: { lat: selectedPosition.lat, lng: selectedPosition.lng },
		});
		onNavigate('addresses');
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
					className='bg-aromas_pink px-6 rounded-3xl text-aromas_gray_text'>
					<Save className='mr-2' /> Guardar
				</Button>
			</div>
		</div>
	);
};

export default ProfileCreateLocation;
