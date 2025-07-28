import React, { useEffect, useState } from 'react';
import type { ICategoryForm } from '../createCatalogs/models/category-form.interface';
import type { IUpdateProps } from './models/update-props.interface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { subCategoriesGetService } from '@/services/catalogs/sub-categories/GET/sub-categories.service.get';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import { putCategory } from '@/services/catalogs/categories/PUT/categories.service.put';

const UpdateCategory: React.FC<IUpdateProps<ICategory>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
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
		if (data) {
			setCategory({
				name: data.name || '',
				subCategories: data.subCategories?.map((sub) => sub._id) || [],
			});
		}
	}, [data]);

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
			await putCategory(id, payload);
			toast.success('Categoría modificada con éxito.');
			onUpdate();
			setOpenUpdateModal(false);
			setCategory({ name: '', subCategories: [] });
			setTouched(false);
		} catch {
			toast.error('Error al actualizar la categoría');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar categoría</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='name'>Nombre</label>
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

export default UpdateCategory;
