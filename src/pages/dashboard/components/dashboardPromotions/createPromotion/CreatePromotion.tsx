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
import { postPromotion } from '@/services/promotions/POST/promotions.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { PromotionValueType } from '@/services/promotions/models/promotions.interface';
import PromotionScopeFields from '../components/PromotionScopeFields';
import {
	toPromotionPayload,
	validatePromotionForm,
} from '../utils/promotionFormValidation';
import type { IPromotionForm } from './models/promotion-form.interface';

const initialState: IPromotionForm = {
	name: '',
	description: '',
	scope: 'ALL',
	categories: [],
	subCategories: [],
	products: [],
	combos: [],
	valueType: 'PERCENTAGE',
	value: 10,
	code: '',
	startsAt: '',
	endsAt: '',
	minPurchase: 0,
	usageLimit: 0,
	usageLimitPerUser: 0,
	isActive: true,
};

const initialTouched = {
	name: false,
	value: false,
	scope: false,
	code: false,
	dates: false,
};

const CreatePromotion = () => {
	const [promotion, setPromotion] = useState<IPromotionForm>(initialState);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [submitDisable, setSubmitDisable] = useState(true);
	const [errors, setErrors] = useState({
		name: '',
		value: '',
		scope: '',
		code: '',
		dates: '',
	});
	const [touched, setTouched] = useState(initialTouched);

	useEffect(() => setErrors(validatePromotionForm(promotion)), [promotion]);

	useEffect(() => {
		const hasErrors = Object.values(errors).some((error) => error !== '');
		setSubmitDisable(hasErrors || !promotion.name || !promotion.value);
	}, [errors, promotion]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type } = e.target;
		setPromotion((prev) => ({
			...prev,
			[name]: type === 'number' ? Number(value) : value,
		}));
	};

	const handleBlur = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setTouched((prev) => ({ ...prev, [e.target.name]: true }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationErrors = validatePromotionForm(promotion);
		if (Object.values(validationErrors).some((error) => error !== '')) {
			setTouched({
				name: true,
				value: true,
				scope: true,
				code: true,
				dates: true,
			});
			setErrors(validationErrors);
			toast.error('Por favor, corrige los errores en el formulario.');
			return;
		}

		setButtonLoading(true);
		try {
			await postPromotion(toPromotionPayload(promotion));
			toast.success('Promoción creada con éxito');
			setPromotion(initialState);
			setTouched(initialTouched);
		} catch (error) {
			console.error('Error creating promotion:', error);
			toast.error(getApiErrorMessage(error, 'Error al crear la promoción'));
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-4xl mx-auto my-8'>
			<CardHeader>
				<CardTitle className='text-center text-2xl font-bold'>
					Crear Nueva Promoción
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid gap-1.5'>
						<label htmlFor='name'>Nombre</label>
						<Input
							id='name'
							name='name'
							value={promotion.name}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Ej: 10% en Velas'
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
							value={promotion.description}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Nota interna sobre la promoción...'
						/>
					</div>

					<PromotionScopeFields
						form={promotion}
						onScopeChange={(scope) => {
							setPromotion((prev) => ({ ...prev, scope }));
							setTouched((prev) => ({ ...prev, scope: true }));
						}}
						onListChange={(field, selected) =>
							setPromotion((prev) => ({ ...prev, [field]: selected }))
						}
						error={touched.scope ? errors.scope : ''}
					/>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='valueType'>Tipo de descuento</label>
							<Select
								onValueChange={(value) =>
									setPromotion((prev) => ({
										...prev,
										valueType: value as PromotionValueType,
									}))
								}
								value={promotion.valueType}>
								<SelectTrigger id='valueType'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='PERCENTAGE'>
										Porcentaje (%)
									</SelectItem>
									<SelectItem value='FIXED'>
										Monto fijo ($)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='value'>
								{promotion.valueType === 'PERCENTAGE'
									? 'Descuento (%)'
									: 'Descuento ($)'}
							</label>
							<Input
								id='value'
								name='value'
								type='number'
								min={1}
								max={promotion.valueType === 'PERCENTAGE' ? 100 : undefined}
								value={promotion.value}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									touched.value && errors.value
										? 'border-red-500 focus-visible:ring-red-500'
										: ''
								}
							/>
							{touched.value && errors.value && (
								<p className='text-sm text-red-600 mt-1'>
									{errors.value}
								</p>
							)}
							{promotion.valueType === 'FIXED' && (
								<p className='text-sm text-aromas_gray_text'>
									Se descuenta del total del pedido, repartido entre
									los productos que alcanza.
								</p>
							)}
						</div>
					</div>

					<div data-tutorial='promotion-coupon' className='grid gap-1.5'>
						<label htmlFor='code'>Código de cupón</label>
						<Input
							id='code'
							name='code'
							value={promotion.code}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Ej: BIENVENIDA'
							className={
								touched.code && errors.code
									? 'border-red-500 focus-visible:ring-red-500'
									: ''
							}
						/>
						{touched.code && errors.code ? (
							<p className='text-sm text-red-600 mt-1'>{errors.code}</p>
						) : (
							<p className='text-sm text-aromas_gray_text'>
								Dejalo vacío para que la promoción se aplique sola. Con
								código, el cliente tiene que escribirlo al finalizar la
								compra.
							</p>
						)}
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='startsAt'>Desde</label>
							<Input
								id='startsAt'
								name='startsAt'
								type='datetime-local'
								value={promotion.startsAt}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='endsAt'>Hasta</label>
							<Input
								id='endsAt'
								name='endsAt'
								type='datetime-local'
								value={promotion.endsAt}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									errors.dates
										? 'border-red-500 focus-visible:ring-red-500'
										: ''
								}
							/>
							{errors.dates ? (
								<p className='text-sm text-red-600 mt-1'>
									{errors.dates}
								</p>
							) : (
								<p className='text-sm text-aromas_gray_text'>
									Dejá las fechas vacías para una promoción sin
									vencimiento.
								</p>
							)}
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='minPurchase'>Compra mínima ($)</label>
							<Input
								id='minPurchase'
								name='minPurchase'
								type='number'
								min={0}
								value={promotion.minPurchase}
								onChange={handleChange}
								placeholder='0'
							/>
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='usageLimit'>Usos totales</label>
							<Input
								id='usageLimit'
								name='usageLimit'
								type='number'
								min={0}
								value={promotion.usageLimit}
								onChange={handleChange}
								placeholder='Sin límite'
							/>
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='usageLimitPerUser'>Usos por cliente</label>
							<Input
								id='usageLimitPerUser'
								name='usageLimitPerUser'
								type='number'
								min={0}
								value={promotion.usageLimitPerUser}
								onChange={handleChange}
								placeholder='Sin límite'
							/>
						</div>
					</div>
					<p className='text-sm text-aromas_gray_text'>
						Un 0 en los límites significa "sin límite". El límite por
						cliente no aplica en ventas de mostrador sin cuenta.
					</p>

					<div className='w-full flex justify-center'>
						<Button
							type='submit'
							className='bg-aromas_pink text-aromas_gray_text'
							disabled={submitDisable || buttonLoading}>
							{buttonLoading && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{buttonLoading ? 'Creando...' : 'Crear Promoción'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreatePromotion;
