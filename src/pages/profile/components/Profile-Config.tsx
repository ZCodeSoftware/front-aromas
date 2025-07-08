import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const ProfileConfig = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
	});

	useEffect(() => {
		setFormData({
			name: 'Luciano Federico',
			email: 'luciano.federico@asd.com',
			phone: '123456789',
		});
	}, []);

	return (
		<div className='flex flex-col w-full justify-center items-center px-6'>
			<div className='flex py-6 flex-col w-full gap-y-6'>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Nombre
					</label>
					<Input
						style={{
							outline: 'none',
							boxShadow: 'none',
						}}
						value={formData.name}
					/>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Email
					</label>
					<Input
						style={{
							outline: 'none',
							boxShadow: 'none',
						}}
						value={formData.email}
					/>
				</div>
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Teléfono
					</label>
					<Input
						style={{
							outline: 'none',
							boxShadow: 'none',
						}}
						value={formData.phone}
					/>
				</div>
			</div>
			<Button className='bg-aromas_pink w-full rounded-3xl text-aromas_gray_text'>
				<Save /> Guardar cambios
			</Button>
		</div>
	);
};

export default ProfileConfig;
