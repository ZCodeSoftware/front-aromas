import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { INamedForm } from './models/named-form.interface';
import { postAssociatedEmotion } from '@/services/catalogs/associated-emotions/POST/associated-emotions.service.post';

const CreateAssociatedEmotion: React.FC = () => {
	const [associatedEmotion, setAssociatedEmotion] = useState<INamedForm>({
		name: '',
	});
	const [submitDisable, setSubmitDisable] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [touched, setTouched] = useState<boolean>(false);

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
			await postAssociatedEmotion(associatedEmotion);
			toast.success('Emoción asociada creada con éxito.');
			setAssociatedEmotion({ name: '' });
			setTouched(false);
		} catch {
			toast.error('Error al crear la emoción');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
			<h2 className='text-2xl font-bold text-center mb-4'>
				Crear Nueva Emocíon
			</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label>Nombre</label>
					<Input
						id='name'
						name='name'
						value={associatedEmotion.name}
						onChange={handleChange}
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

				<Button
					color='primary'
					type='submit'
					className='mt-4 bg-aromas_pink text-aromas_gray_text'
					disabled={submitDisable || buttonLoading}>
					{buttonLoading ? 'Loading...' : 'Crear Emoción'}
				</Button>
			</form>
		</div>
	);
};

export default CreateAssociatedEmotion;
