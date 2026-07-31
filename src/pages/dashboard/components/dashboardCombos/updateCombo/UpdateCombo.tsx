import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { putCombo } from '@/services/combos/PUT/combos.service.put';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type {
	ComboPriceMode,
	IComboData,
} from '@/services/combos/models/combos.interface';
import type { IUpdateProps } from '../../dashboardCatalogs/updateCatalogs/models/update-props.interface';
import UploadImage from '../../uploadImage/UploadImage';
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary';
import ComboItemsPicker from '../components/ComboItemsPicker';
import ComboPriceSummary from '../components/ComboPriceSummary';
import { validateComboForm } from '../utils/comboFormValidation';
import type { IComboForm } from '../createCombo/models/combo-form.interface';

const emptyForm: IComboForm = {
	name: '',
	description: '',
	images: [],
	items: [],
	priceMode: 'PERCENTAGE',
	fixedPrice: 0,
	discountPercentage: 10,
	isActive: true,
};

const UpdateCombo: React.FC<IUpdateProps<IComboData>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
	const [combo, setCombo] = useState<IComboForm>(emptyForm);
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [imageFiles, setImageFiles] = useState<Blob[]>([]);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [submitDisable, setSubmitDisable] = useState(true);
	const [errors, setErrors] = useState({
		name: '',
		description: '',
		items: '',
		price: '',
	});
	const [touched, setTouched] = useState({
		name: false,
		description: false,
		items: false,
		price: false,
	});

	useEffect(() => {
		if (!data) return;

		setCombo({
			name: data.name || '',
			description: data.description || '',
			images: data.images || [],
			// The API returns the components populated, which is already the shape
			// the picker edits.
			items: (data.items || []).map((item) => ({
				product: item.product,
				quantity: item.quantity,
			})),
			priceMode: data.priceMode || 'PERCENTAGE',
			fixedPrice: data.fixedPrice ?? 0,
			discountPercentage: data.discountPercentage ?? 10,
			isActive: data.isActive,
		});
		setExistingImages(data.images || []);
		setImageFiles([]);
	}, [data]);

	useEffect(() => setErrors(validateComboForm(combo)), [combo]);

	useEffect(() => {
		const hasErrors = Object.values(errors).some((error) => error !== '');
		setSubmitDisable(hasErrors || !combo.name || !combo.items.length);
	}, [errors, combo]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type } = e.target;
		setCombo((prev) => ({
			...prev,
			[name]: type === 'number' ? Number(value) : value,
		}));
	};

	const handleBlur = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setTouched((prev) => ({ ...prev, [e.target.name]: true }));
	};

	/** Only dropped from the form; nothing is saved until the dialog is submitted. */
	const handleDeleteExistingImage = (url: string) => {
		setExistingImages((prev) => prev.filter((image) => image !== url));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationErrors = validateComboForm(combo);
		if (Object.values(validationErrors).some((error) => error !== '')) {
			setTouched({
				name: true,
				description: true,
				items: true,
				price: true,
			});
			setErrors(validationErrors);
			toast.error('Por favor, corrige los errores en el formulario.');
			return;
		}

		setButtonLoading(true);
		try {
			const uploadedImages = imageFiles.length
				? await uploadToCloudinary(imageFiles, 'Combos', combo)
				: [];
			const finalImages = [
				...existingImages,
				...uploadedImages.filter((url): url is string => url !== null),
			];

			await putCombo(id, {
				name: combo.name,
				description: combo.description || undefined,
				images: finalImages,
				items: combo.items.map((item) => ({
					productId: item.product._id,
					quantity: item.quantity,
				})),
				priceMode: combo.priceMode,
				fixedPrice:
					combo.priceMode === 'FIXED' ? combo.fixedPrice : undefined,
				discountPercentage:
					combo.priceMode === 'PERCENTAGE'
						? combo.discountPercentage
						: undefined,
			});

			toast.success('Combo modificado con éxito.');
			await onUpdate();
			setOpenUpdateModal(false);
		} catch (error) {
			console.error('Error updating combo:', error);
			toast.error(getApiErrorMessage(error, 'Error al actualizar el combo'));
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-3xl bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar combo</DialogTitle>
				</DialogHeader>

				<div className='max-h-[70vh] overflow-y-auto px-1'>
					<form
						id='update-combo-form'
						onSubmit={handleSubmit}
						className='space-y-6 pt-2'>
						<div className='grid gap-1.5'>
							<label htmlFor='update-combo-name'>
								Nombre del Combo
							</label>
							<Input
								id='update-combo-name'
								name='name'
								value={combo.name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									touched.name && errors.name
										? 'border-red-500 focus-visible:ring-red-500'
										: ''
								}
							/>
							{touched.name && errors.name && (
								<p className='text-sm text-red-600 mt-1'>
									{errors.name}
								</p>
							)}
						</div>

						<div className='grid gap-1.5'>
							<label htmlFor='update-combo-description'>
								Descripción
							</label>
							<Textarea
								id='update-combo-description'
								name='description'
								value={combo.description}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									touched.description && errors.description
										? 'border-red-500 focus-visible:ring-red-500'
										: ''
								}
							/>
							{touched.description && errors.description && (
								<p className='text-sm text-red-600 mt-1'>
									{errors.description}
								</p>
							)}
						</div>

						<div className='grid gap-1.5'>
							<label>Productos del combo</label>
							<ComboItemsPicker
								value={combo.items}
								onChange={(items) => {
									setCombo((prev) => ({ ...prev, items }));
									setTouched((prev) => ({
										...prev,
										items: true,
									}));
								}}
							/>
							{touched.items && errors.items && (
								<p className='text-sm text-red-600 mt-1'>
									{errors.items}
								</p>
							)}
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='grid gap-1.5'>
								<label htmlFor='update-combo-price-mode'>
									Modo de precio
								</label>
								<Select
									onValueChange={(value) => {
										setCombo((prev) => ({
											...prev,
											priceMode: value as ComboPriceMode,
										}));
										setTouched((prev) => ({
											...prev,
											price: true,
										}));
									}}
									value={combo.priceMode}>
									<SelectTrigger id='update-combo-price-mode'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className='bg-white'>
										<SelectItem value='PERCENTAGE'>
											Descuento % sobre la suma
										</SelectItem>
										<SelectItem value='FIXED'>
											Precio fijo
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{combo.priceMode === 'FIXED' ? (
								<div className='grid gap-1.5'>
									<label htmlFor='update-combo-fixed-price'>
										Precio del combo
									</label>
									<Input
										id='update-combo-fixed-price'
										name='fixedPrice'
										type='number'
										min={0}
										step='0.01'
										value={combo.fixedPrice}
										onChange={handleChange}
										onBlur={handleBlur}
										className={
											touched.price && errors.price
												? 'border-red-500 focus-visible:ring-red-500'
												: ''
										}
									/>
									{touched.price && errors.price && (
										<p className='text-sm text-red-600 mt-1'>
											{errors.price}
										</p>
									)}
								</div>
							) : (
								<div className='grid gap-1.5'>
									<label htmlFor='update-combo-discount'>
										Descuento (%)
									</label>
									<Input
										id='update-combo-discount'
										name='discountPercentage'
										type='number'
										min={1}
										max={100}
										value={combo.discountPercentage}
										onChange={handleChange}
										onBlur={handleBlur}
										className={
											touched.price && errors.price
												? 'border-red-500 focus-visible:ring-red-500'
												: ''
										}
									/>
									{touched.price && errors.price && (
										<p className='text-sm text-red-600 mt-1'>
											{errors.price}
										</p>
									)}
								</div>
							)}
						</div>

						<ComboPriceSummary form={combo} />

						{existingImages.length > 0 && (
							<div className='grid gap-1.5'>
								<label>Imágenes actuales</label>
								<div className='flex flex-wrap gap-3'>
									{existingImages.map((url) => (
										<div key={url} className='relative'>
											<img
												src={url}
												alt='Imagen del combo'
												className='h-20 w-20 rounded-md object-cover'
											/>
											<button
												type='button'
												aria-label='Quitar imagen'
												onClick={() =>
													handleDeleteExistingImage(url)
												}
												className='absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white'>
												<X className='h-3 w-3' />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						<div className='w-full flex justify-center'>
							<UploadImage
								setUrl={setImageFiles}
								form={combo}
								imageFiles={imageFiles}
								customStyle='md:w-2/4'
							/>
						</div>
					</form>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type='button' variant='outline'>
							Cancelar
						</Button>
					</DialogClose>
					<Button
						type='submit'
						form='update-combo-form'
						disabled={submitDisable || buttonLoading}>
						{buttonLoading && (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						)}
						Guardar cambios
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateCombo;
