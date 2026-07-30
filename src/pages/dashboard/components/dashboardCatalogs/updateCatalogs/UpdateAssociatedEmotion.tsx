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
import type { IAssociatedEmotion } from '@/services/catalogs/associated-emotions/models/associated-emotion.interface';
import { putAssociatedEmotion } from '@/services/catalogs/associated-emotions/PUT/associated-emotions.service.put';

const UpdateAssociatedEmotion: React.FC<IUpdateProps<IAssociatedEmotion>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
	const [associatedEmotion, setAssociatedEmotion] = useState<INamedForm>({
		name: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

	useEffect(() => {
		if (data) {
			setAssociatedEmotion({
				name: data.name || '',
			});
		}
	}, [data]);

	useEffect(() => {
		let errorMessage = '';
		if (!associatedEmotion.name) {
			errorMessage = 'El nombre de la emoción es requerido.';
		}
		setError(errorMessage);
	}, [associatedEmotion.name]);

	useEffect(() => {
		setSubmitDisable(!!error || !associatedEmotion.name);
	}, [error, associatedEmotion.name]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setAssociatedEmotion((prevAssociatedEmotion) => ({
			...prevAssociatedEmotion,
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
			await putAssociatedEmotion(id, associatedEmotion);
			toast.success('Emoción modificada con éxito.');
			onUpdate();
			setOpenUpdateModal(false);
			setAssociatedEmotion({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al actualizar la emoción');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar emoción</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='name'>Nombre</label>
						<Input
							name='name'
							value={associatedEmotion.name}
							onChange={handleChange}
							required
							onBlur={handleBlur}
							placeholder='Ej: Fortuna'
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

export default UpdateAssociatedEmotion;
