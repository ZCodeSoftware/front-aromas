import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { INamedForm } from './models/named-form.interface';
import { postSubCategory } from '@/services/catalogs/sub-categories/POST/sub-categories.service.post';

const CreateSubCategory: React.FC = () => {
	const [subCategory, setSubCategory] = useState<INamedForm>({
		name: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		let errorMessage = '';
		if (!subCategory.name) {
			errorMessage = 'El nombre de la sub-categoría es requerido.';
		}
		setError(errorMessage);
	}, [subCategory.name]);

	useEffect(() => {
		setSubmitDisable(!!error || !subCategory.name);
	}, [error, subCategory.name]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setSubCategory((prevSubCategory) => ({
			...prevSubCategory,
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
			await postSubCategory(subCategory);
			toast.success('Sub-categoría asociada creada con éxito.');
			setSubCategory({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al crear la sub-categoría');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
			<h2 className='text-2xl font-bold text-center mb-4'>
				Crear Nueva Sub-categoría
			</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label>Nombre</label>
					<Input
						id='name'
						name='name'
						value={subCategory.name}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder='Ej: Porta sahumerios'
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
					{buttonLoading ? 'Loading...' : 'Crear Sub-categoría'}
				</Button>
			</form>
		</div>
	);
};

export default CreateSubCategory;
