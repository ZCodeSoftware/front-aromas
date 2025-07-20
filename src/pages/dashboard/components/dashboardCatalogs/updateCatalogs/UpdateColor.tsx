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
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import type { IColorForm } from '../createCatalogs/models/color-form.interface';
import { putColor } from '@/services/catalogs/colors/PUT/colors.service.put';

const UpdateColor: React.FC<IUpdateProps<IColor>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
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
		if (data) {
			setColor({
				name: data.name || '',
				hex: data.hex || '',
			});
		}
	}, [data]);

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
		setSubmitDisable(!!error || !color.name || !color.hex);
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
		if (error) {
			toast.error('Por favor, corrige el error en el formulario.');
			return;
		}
		setButtonLoading(true);
		try {
			await putColor(id, color);
			toast.success('Color modificado con éxito.');
			onUpdate();
			setOpenUpdateModal(false);
			setColor({ name: '', hex: '' });
			setTouched({
				name: false,
				hex: false,
			});
		} catch {
			toast.error('Error al actualizar la color');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-md bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar color</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 pt-4'>
					<div className='grid gap-2'>
						<label htmlFor='name'>Nombre</label>
						<Input
							name='name'
							value={color.name}
							onChange={handleChange}
							required
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
							<p className='text-sm text-red-600 mt-1'>
								{error.hex}
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
							Guardar cambios
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateColor;
