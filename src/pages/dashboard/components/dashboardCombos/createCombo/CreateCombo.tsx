import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { postCombo } from '@/services/combos/POST/combos.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { ComboPriceMode } from '@/services/combos/models/combos.interface';
import UploadImage from '../../uploadImage/UploadImage';
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary';
import ComboItemsPicker from '../components/ComboItemsPicker';
import ComboPriceSummary from '../components/ComboPriceSummary';
import { validateComboForm } from '../utils/comboFormValidation';
import type { IComboForm } from './models/combo-form.interface';

const initialState: IComboForm = {
	name: '',
	description: '',
	images: [],
	items: [],
	priceMode: 'PERCENTAGE',
	fixedPrice: 0,
	discountPercentage: 10,
	isActive: true,
};

const initialTouched = {
	name: false,
	description: false,
	items: false,
	price: false,
};

const CreateCombo = () => {
	const [combo, setCombo] = useState<IComboForm>(initialState);
	const [imageFiles, setImageFiles] = useState<Blob[]>([]);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [submitDisable, setSubmitDisable] = useState(true);
	const [errors, setErrors] = useState({
		name: '',
		description: '',
		items: '',
		price: '',
	});
	const [touched, setTouched] = useState(initialTouched);

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

	const handlePriceModeChange = (priceMode: ComboPriceMode) => {
		setCombo((prev) => ({ ...prev, priceMode }));
		setTouched((prev) => ({ ...prev, price: true }));
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
			const validImages = uploadedImages.filter(
				(url): url is string => url !== null
			);

			await postCombo({
				name: combo.name,
				description: combo.description || undefined,
				images: validImages,
				items: combo.items.map((item) => ({
					productId: item.product._id,
					quantity: item.quantity,
				})),
				priceMode: combo.priceMode,
				// Only the field its mode uses: the API rejects a combo priced on
				// the one it ignores.
				fixedPrice:
					combo.priceMode === 'FIXED' ? combo.fixedPrice : undefined,
				discountPercentage:
					combo.priceMode === 'PERCENTAGE'
						? combo.discountPercentage
						: undefined,
			});

			toast.success('Combo creado con éxito');
			setCombo(initialState);
			setImageFiles([]);
			setTouched(initialTouched);
		} catch (error) {
			console.error('Error creating combo:', error);
			toast.error(getApiErrorMessage(error, 'Error al crear el combo'));
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-4xl mx-auto my-8'>
			<CardHeader>
				<CardTitle className='text-center text-2xl font-bold'>
					Crear Nuevo Combo
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid gap-1.5'>
						<label htmlFor='name'>Nombre del Combo</label>
						<Input
							id='name'
							name='name'
							value={combo.name}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Ej: Combo Relax'
							className={
								touched.name && errors.name
									? 'border-red-500 focus-visible:ring-red-500'
									: ''
							}
						/>
						{touched.name && errors.name && (
							<p className='text-sm text-red-600 mt-1'>{errors.name}</p>
						)}
					</div>

					<div className='grid gap-1.5'>
						<label htmlFor='description'>Descripción</label>
						<Textarea
							id='description'
							name='description'
							value={combo.description}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Describe el combo...'
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
								setTouched((prev) => ({ ...prev, items: true }));
							}}
						/>
						{touched.items && errors.items && (
							<p className='text-sm text-red-600 mt-1'>
								{errors.items}
							</p>
						)}
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div
							data-tutorial='combo-price-mode'
							className='grid gap-1.5'>
							<label htmlFor='priceMode'>Modo de precio</label>
							<Select
								onValueChange={(value) =>
									handlePriceModeChange(value as ComboPriceMode)
								}
								value={combo.priceMode}>
								<SelectTrigger id='priceMode'>
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
								<label htmlFor='fixedPrice'>
									Precio del combo
								</label>
								<Input
									id='fixedPrice'
									name='fixedPrice'
									type='number'
									min={0}
									step='0.01'
									value={combo.fixedPrice}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder='0'
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
								<label htmlFor='discountPercentage'>
									Descuento (%)
								</label>
								<Input
									id='discountPercentage'
									name='discountPercentage'
									type='number'
									min={1}
									max={100}
									value={combo.discountPercentage}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder='10'
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

					<div className='w-full flex justify-center'>
						<UploadImage
							setUrl={setImageFiles}
							form={combo}
							imageFiles={imageFiles}
							customStyle='md:w-2/4'
						/>
					</div>

					<div className='w-full flex justify-center'>
						<Button
							type='submit'
							className='bg-aromas_pink text-aromas_gray_text'
							disabled={submitDisable || buttonLoading}>
							{buttonLoading && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{buttonLoading ? 'Creando...' : 'Crear Combo'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateCombo;
