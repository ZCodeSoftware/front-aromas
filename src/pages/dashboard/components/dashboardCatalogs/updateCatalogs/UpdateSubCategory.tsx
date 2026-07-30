import React, { useEffect, useState } from 'react';
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
import type { INamedForm } from '../createCatalogs/models/named-form.interface';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';
import { putSubCategory } from '@/services/catalogs/sub-categories/PUT/sub-categories.service.put';

const UpdateSubCategory: React.FC<IUpdateProps<ISubCategory>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
	const [subCategory, setSubCategory] = useState<INamedForm>({
		name: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		if (data) {
			setSubCategory({
				name: data.name || '',
			});
		}
	}, [data]);

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
			await putSubCategory(id, subCategory);
			toast.success('Sub-categoría modificada con éxito.');
			onUpdate();
			setOpenUpdateModal(false);
			setSubCategory({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al actualizar la sub-categoría');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar sub-categoría</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='name'>Nombre</label>
						<Input
							name='name'
							value={subCategory.name}
							onChange={handleChange}
							required
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

export default UpdateSubCategory;
