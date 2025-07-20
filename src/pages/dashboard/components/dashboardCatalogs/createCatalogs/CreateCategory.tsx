import React, { useEffect, useState } from 'react';
import type { ICategoryForm } from './models/category-form.interface';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';
import { subCategoriesGetService } from '@/services/catalogs/sub-categories/GET/sub-categories.service.get';
import { MultiSelect } from '@/components/ui/multi-select';
import { postCategory } from '@/services/catalogs/categories/POST/categories.service.post';

const CreateCategory: React.FC = () => {
	const [category, setCategory] = useState<ICategoryForm>({
		name: '',
		subCategories: [],
	});
	const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		const fetchSubCategories = async () => {
			const response = await subCategoriesGetService.getSubCategories();
			if (response) {
				setSubCategories(response);
			}
		};
		fetchSubCategories();
	}, []);

	useEffect(() => {
		let errorMessage = '';
		if (!category.name) {
			errorMessage = 'El nombre de la categoría es requerido.';
		}
		setError(errorMessage);
	}, [category.name]);

	useEffect(() => {
		setSubmitDisable(!!error || !category.name);
	}, [error, category.name]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setCategory((prevCategory) => ({
			...prevCategory,
			[name]: value,
		}));
	};

	const handleBlur = () => {
		setTouched(true);
	};

	const handleMultiSelectChange = (selectedIds: string[]) => {
		setCategory((prev) => ({
			...prev,
			subCategories: selectedIds,
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
			const payload: Partial<ICategoryForm> = {
				name: category.name,
			};
			if (category.subCategories) {
				payload.subCategories = category.subCategories;
			}
			await postCategory(payload);
			toast.success('Categoría asociada creada con éxito.');
			setCategory({ name: '', subCategories: [] });
			setTouched(false);
		} catch {
			toast.error('Error al crear la categoría');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
			<h2 className='text-2xl font-bold text-center mb-4'>
				Crear Nueva Categoría
			</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label>Nombre</label>
					<Input
						name='name'
						value={category.name}
						onChange={handleChange}
						required
						onBlur={handleBlur}
						placeholder='Ej: Velas'
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

				<div className='grid gap-1.5'>
					<label htmlFor='subCategory'>Sub-Categoría</label>
					<MultiSelect
						options={subCategories}
						selected={category.subCategories}
						onChange={handleMultiSelectChange}
						placeholder='Seleccioná sub-categorías...'
						className='w-full'
						disabled={category.name.length === 0}
					/>
				</div>

				<Button
					color='primary'
					type='submit'
					className='mt-4 bg-aromas_pink text-aromas_gray_text'
					disabled={submitDisable || buttonLoading}>
					{buttonLoading ? 'Loading...' : 'Crear Categoría'}
				</Button>
			</form>
		</div>
	);
};

export default CreateCategory;
