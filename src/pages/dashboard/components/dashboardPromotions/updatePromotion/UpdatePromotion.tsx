import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
import { putPromotion } from '@/services/promotions/PUT/promotions.service.put';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type {
	IPromotionData,
	PromotionValueType,
} from '@/services/promotions/models/promotions.interface';
import type { IUpdateProps } from '../../dashboardCatalogs/updateCatalogs/models/update-props.interface';
import PromotionScopeFields from '../components/PromotionScopeFields';
import {
	toDateTimeLocal,
	toPromotionPayload,
	validatePromotionForm,
} from '../utils/promotionFormValidation';
import type { IPromotionForm } from '../createPromotion/models/promotion-form.interface';

const emptyForm: IPromotionForm = {
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

const UpdatePromotion: React.FC<IUpdateProps<IPromotionData>> = ({
	openUpdateModal,
	setOpenUpdateModal,
	data,
	id,
	onUpdate,
}) => {
	const [promotion, setPromotion] = useState<IPromotionForm>(emptyForm);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [submitDisable, setSubmitDisable] = useState(true);
	const [errors, setErrors] = useState({
		name: '',
		value: '',
		scope: '',
		code: '',
		dates: '',
	});
	const [touched, setTouched] = useState({
		name: false,
		value: false,
		scope: false,
		code: false,
		dates: false,
	});

	useEffect(() => {
		if (!data) return;

		setPromotion({
			name: data.name || '',
			description: data.description || '',
			scope: data.scope || 'ALL',
			// The lists come back populated for the table; the form only needs ids.
			categories: (data.categories || []).map((item) => item._id),
			subCategories: (data.subCategories || []).map((item) => item._id),
			products: (data.products || []).map((item) => item._id),
			combos: (data.combos || []).map((item) => item._id),
			valueType: data.valueType || 'PERCENTAGE',
			value: data.value ?? 0,
			code: data.code || '',
			startsAt: toDateTimeLocal(data.startsAt),
			endsAt: toDateTimeLocal(data.endsAt),
			minPurchase: data.minPurchase ?? 0,
			usageLimit: data.usageLimit ?? 0,
			usageLimitPerUser: data.usageLimitPerUser ?? 0,
			isActive: data.isActive,
		});
	}, [data]);

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
			await putPromotion(id, toPromotionPayload(promotion));
			toast.success('Promoción modificada con éxito.');
			await onUpdate();
			setOpenUpdateModal(false);
		} catch (error) {
			console.error('Error updating promotion:', error);
			toast.error(
				getApiErrorMessage(error, 'Error al actualizar la promoción')
			);
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-3xl bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar promoción</DialogTitle>
				</DialogHeader>

				<div className='max-h-[70vh] overflow-y-auto px-1'>
					<form
						id='update-promotion-form'
						onSubmit={handleSubmit}
						className='space-y-6 pt-2'>
						<div className='grid gap-1.5'>
							<label htmlFor='update-promotion-name'>Nombre</label>
							<Input
								id='update-promotion-name'
								name='name'
								value={promotion.name}
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
							<label htmlFor='update-promotion-description'>
								Descripción
							</label>
							<Textarea
								id='update-promotion-description'
								name='description'
								value={promotion.description}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>

						<PromotionScopeFields
							form={promotion}
							onScopeChange={(scope) => {
								setPromotion((prev) => ({ ...prev, scope }));
								setTouched((prev) => ({ ...prev, scope: true }));
							}}
							onListChange={(field, selected) =>
								setPromotion((prev) => ({
									...prev,
									[field]: selected,
								}))
							}
							error={touched.scope ? errors.scope : ''}
						/>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='grid gap-1.5'>
								<label htmlFor='update-promotion-value-type'>
									Tipo de descuento
								</label>
								<Select
									onValueChange={(value) =>
										setPromotion((prev) => ({
											...prev,
											valueType: value as PromotionValueType,
										}))
									}
									value={promotion.valueType}>
									<SelectTrigger id='update-promotion-value-type'>
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
								<label htmlFor='update-promotion-value'>
									{promotion.valueType === 'PERCENTAGE'
										? 'Descuento (%)'
										: 'Descuento ($)'}
								</label>
								<Input
									id='update-promotion-value'
									name='value'
									type='number'
									min={1}
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
							</div>
						</div>

						<div className='grid gap-1.5'>
							<label htmlFor='update-promotion-code'>
								Código de cupón
							</label>
							<Input
								id='update-promotion-code'
								name='code'
								value={promotion.code}
								onChange={handleChange}
								onBlur={handleBlur}
								className={
									touched.code && errors.code
										? 'border-red-500 focus-visible:ring-red-500'
										: ''
								}
							/>
							{touched.code && errors.code ? (
								<p className='text-sm text-red-600 mt-1'>
									{errors.code}
								</p>
							) : (
								<p className='text-sm text-aromas_gray_text'>
									Vaciarlo convierte la promoción en automática.
								</p>
							)}
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='grid gap-1.5'>
								<label htmlFor='update-promotion-starts'>Desde</label>
								<Input
									id='update-promotion-starts'
									name='startsAt'
									type='datetime-local'
									value={promotion.startsAt}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
							<div className='grid gap-1.5'>
								<label htmlFor='update-promotion-ends'>Hasta</label>
								<Input
									id='update-promotion-ends'
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
								{errors.dates && (
									<p className='text-sm text-red-600 mt-1'>
										{errors.dates}
									</p>
								)}
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<div className='grid gap-1.5'>
								<label htmlFor='update-promotion-min'>
									Compra mínima ($)
								</label>
								<Input
									id='update-promotion-min'
									name='minPurchase'
									type='number'
									min={0}
									value={promotion.minPurchase}
									onChange={handleChange}
								/>
							</div>
							<div className='grid gap-1.5'>
								<label htmlFor='update-promotion-limit'>
									Usos totales
								</label>
								<Input
									id='update-promotion-limit'
									name='usageLimit'
									type='number'
									min={0}
									value={promotion.usageLimit}
									onChange={handleChange}
								/>
							</div>
							<div className='grid gap-1.5'>
								<label htmlFor='update-promotion-limit-user'>
									Usos por cliente
								</label>
								<Input
									id='update-promotion-limit-user'
									name='usageLimitPerUser'
									type='number'
									min={0}
									value={promotion.usageLimitPerUser}
									onChange={handleChange}
								/>
							</div>
						</div>

						{data && data.usedCount > 0 && (
							<p className='text-sm text-aromas_gray_text'>
								Esta promoción ya se usó {data.usedCount} vez/veces.
								Bajar el límite total por debajo de ese número la deja
								sin usos disponibles.
							</p>
						)}
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
						form='update-promotion-form'
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

export default UpdatePromotion;
