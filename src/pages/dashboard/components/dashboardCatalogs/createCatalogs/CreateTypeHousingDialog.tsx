import React, { useEffect, useState } from 'react';
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
import type { INamedForm } from './models/named-form.interface';
import { postTypeHousing } from '@/services/catalogs/type-housing/POST/type-housing.service.post';

interface CreateTypeHousingDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onCreated: () => void;
}

const CreateTypeHousingDialog: React.FC<CreateTypeHousingDialogProps> = ({
	open,
	setOpen,
	onCreated,
}) => {
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
			onCreated();
			setOpen(false);
			setTypeHousing({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al crear el tipo de vivienda');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Crear tipo de vivienda</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='name'>Nombre</label>
						<Input
							name='name'
							value={typeHousing.name}
							onChange={handleChange}
							required
							onBlur={handleBlur}
							placeholder='Ej: Casa'
							className={`mt-1 ${
								touched && error
									? 'border-red-500 focus-visible:ring-red-500'
									: ''
							}`}
						/>
						{touched && error && (
							<p className='text-sm text-red-600 mt-1'>
								{error}
							</p>
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
							Crear
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTypeHousingDialog;
