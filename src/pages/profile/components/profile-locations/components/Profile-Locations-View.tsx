import { Edit, Home, PlusIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { IProfileLocationsSubpagesProps } from '../models/profile-locations-subpages-props.interface';

const ProfileLocationsView: React.FC<IProfileLocationsSubpagesProps> = ({
	onNavigate,
}) => {
	const [locations, setLocations] = useState({
		name: '',
		street: '',
		floor_address: '',
		number: '',
		zip_code: '',
		description: '',
	});

	useEffect(() => {
		setLocations({
			name: 'Casa',
			street: 'Calle Principal',
			floor_address: '',
			number: '123',
			zip_code: '28001',
			description: 'Casa principal',
		});
	}, []);

	return (
		<div className='p-2'>
			<div className='w-full flex justify-end'>
				<Button
					onClick={() => onNavigate('createLocation')}
					className='bg-aromas_pink rounded-3xl'>
					<PlusIcon /> Agregar dirección
				</Button>
			</div>
			<div className='flex items-center space-x-4 rounded-lg py-6'>
				<div className='w-full flex'>
					<Home className='mx-2 text-aromas_fucsia' />
					<div className='w-full flex justify-between px-2'>
						<div className='flex w-full flex-col'>
							<p className='text-aromas_gray_text font-bold'>
								{locations.name}
							</p>
							<p className='text-aromas_gray_text'>
								{`${locations.street} ${locations.number}`}
							</p>
							<p className='text-aromas_gray_text'>
								{`CP: ${locations.zip_code}`}
							</p>
							<p className='text-aromas_gray_text'>
								{locations.description}
							</p>
						</div>
						<div className='flex items-start space-x-4'>
							<button
								onClick={() => onNavigate('updateLocation')}>
								<Edit
									size={23}
									className='text-aromas_fucsia'
								/>
							</button>
							<button>
								<Trash2
									size={22}
									className='text-aromas_fucsia'
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileLocationsView;
