import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { INamedForm } from './models/named-form.interface';
import { postTypeHousing } from '@/services/catalogs/type-housing/POST/type-housing.service.post';

const CreateTypeHousing: React.FC = () => {
	const [typeHousing, setTypeHousing] = useState<INamedForm>({
		name: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		let errorMessage = '';
		if (!typeHousing.name) {
			errorMessage = 'El nombre del tipo de vivienda es requerido.';
		}
		setError(errorMessage);
	}, [typeHousing.name]);

	useEffect(() => {
		setSubmitDisable(!!error || !typeHousing.name);
	}, [error, typeHousing.name]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTypeHousing((prevTypeHousing) => ({
			...prevTypeHousing,
			[name]: value,
		}));
	};

	const handleBlur = () => {
		setTouched(true);
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
			await postTypeHousing(typeHousing);
			toast.success('Tipo de vivienda creado con éxito.');
			setTypeHousing({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al crear el tipo de vivienda');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
			<h2 className='text-2xl font-bold text-center mb-4'>
				Crear Nuevo Tipo de Vivienda
			</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label>Nombre</label>
					<Input
						id='name'
						name='name'
						value={typeHousing.name}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder='Ej: Casa'
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

				<Button
					color='primary'
					type='submit'
					className='mt-4 bg-aromas_pink text-aromas_gray_text'
					disabled={submitDisable || buttonLoading}>
					{buttonLoading ? 'Loading...' : 'Crear Tipo de Vivienda'}
				</Button>
			</form>
		</div>
	);
};

export default CreateTypeHousing;
