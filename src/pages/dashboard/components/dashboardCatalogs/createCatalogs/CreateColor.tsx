import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { IColorForm } from './models/color-form.interface';
import { postColor } from '@/services/catalogs/colors/POST/colors.service.post';

const CreateColor: React.FC = () => {
	const [color, setColor] = useState<IColorForm>({
		name: '',
		hex: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState({ name: '', hex: '' });
	const [touched, setTouched] = useState({
		name: false,
		hex: false,
	});

	useEffect(() => {
		let errorNameMessage = '';
		let errorColorMessage = '';
		if (!color.name) {
			errorNameMessage = 'El nombre del color es requerido.';
		} else if (!color.hex) {
			errorColorMessage = 'El color es requerido.';
		}
		setError({ name: errorNameMessage, hex: errorColorMessage });
	}, [color.name, color.hex]);

	useEffect(() => {
		setSubmitDisable(
			!!error.hex || !!error.name || !color.name || !color.hex
		);
	}, [error, color.name, color.hex]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setColor((prevColor) => ({
			...prevColor,
			[name]: value,
		}));
	};

	const handleBlur = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name } = e.target;
		setTouched((prev) => ({
			...prev,
			[name as keyof typeof touched]: true,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setTouched({
			name: true,
			hex: true,
		});
		if (error.name || error.hex) {
			toast.error('Por favor, corrige el error en el formulario.');
			return;
		}
		setButtonLoading(true);
		try {
			await postColor(color);
			toast.success('Color asociada creada con éxito.');
			setColor({ name: '', hex: '' });
			setTouched({
				name: false,
				hex: false,
			});
		} catch {
			toast.error('Error al crear el color');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
			<h2 className='text-2xl font-bold text-center mb-4'>
				Crear Nuevo Color
			</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label>Nombre</label>
					<Input
						id='name'
						name='name'
						value={color.name}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder='Ej: Rosa'
						className={`mt-1 ${
							touched.name && error.name
								? 'border-red-500 focus-visible:ring-red-500'
								: ''
						}`}
					/>
					{touched.name && error.name && (
						<p className='text-sm text-red-600 mt-1'>
							{error.name}
						</p>
					)}
				</div>
				<div>
					<label>Color</label>
					<Input
						id='hex'
						name='hex'
						type='color'
						value={color.hex}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`mt-1 ${
							touched.hex && error.hex
								? 'border-red-500 focus-visible:ring-red-500'
								: ''
						}`}
					/>
					{touched.hex && error.hex && (
						<p className='text-sm text-red-600 mt-1'>{error.hex}</p>
					)}
				</div>

				<Button
					color='primary'
					type='submit'
					className='mt-4 bg-aromas_pink text-aromas_gray_text'
					disabled={submitDisable || buttonLoading}>
					{buttonLoading ? 'Loading...' : 'Crear Color'}
				</Button>
			</form>
		</div>
	);
};

export default CreateColor;
