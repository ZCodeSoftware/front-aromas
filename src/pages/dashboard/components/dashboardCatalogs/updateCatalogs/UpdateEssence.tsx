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
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import { putEssence } from '@/services/catalogs/essences/PUT/essences.service.put';

const UpdateEssence: React.FC<IUpdateProps<IEssence>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
	const [essence, setEssence] = useState<INamedForm>({
		name: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		if (data) {
			setEssence({
				name: data.name || '',
			});
		}
	}, [data]);

	useEffect(() => {
		let errorMessage = '';
		if (!essence.name) {
			errorMessage = 'El nombre de la esencia es requerido.';
		}
		setError(errorMessage);
	}, [essence.name]);

	useEffect(() => {
		setSubmitDisable(!!error || !essence.name);
	}, [error, essence.name]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setEssence((prevEssence) => ({
			...prevEssence,
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
			await putEssence(id, essence);
			toast.success('Esencia modificada con éxito.');
			onUpdate();
			setOpenUpdateModal(false);
			setEssence({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al actualizar la esencia');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar esencia</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='name'>Nombre</label>
						<Input
							name='name'
							value={essence.name}
							onChange={handleChange}
							required
							onBlur={handleBlur}
							placeholder='Ej: Vainilla'
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

export default UpdateEssence;
