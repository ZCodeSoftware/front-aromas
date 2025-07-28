// src/features/products/createProduct/CreateProduct.tsx

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { IProductForm } from './models/product-form.interface';
import { categoriesGetService } from '@/services/catalogs/categories/GET/categories.service.get';
import { colorsGetService } from '@/services/catalogs/colors/GET/colors.service.get';
import { associatedEmotionsGetService } from '@/services/catalogs/associated-emotions/GET/associated-emotions.service';
import { brandsGetService } from '@/services/catalogs/brand/GET/brands.service.get';
import { essencesGetService } from '@/services/catalogs/essences/GET/essences.service.get';
import { postProduct } from '@/services/products/POST/products.service.post';
import UploadImage from '../../uploadImage/UploadImage';
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import type { IBrand } from '@/services/catalogs/brand/models/brands.interface';
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import type { IAssociatedEmotion } from '@/services/catalogs/associated-emotions/models/associated-emotion.interface';
import { validateProductForm } from '../utils/productFromValidation/productFormValidation';

const initialState: IProductForm = {
	name: '',
	price: 0,
	description: '',
	images: [],
	color: '',
	category: '',
	subCategory: '',
	essence: '',
	associatedEmotion: '',
	brand: '',
	isActive: true,
	stock: 0,
};

const CreateProduct: React.FC = () => {
	const [product, setProduct] = useState<IProductForm>(initialState);
	const [imageFiles, setImageFiles] = useState<Blob[]>([]);

	const [categories, setCategories] = useState<ICategory[]>([]);
	const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
	const [colors, setColors] = useState<IColor[]>([]);
	const [brands, setBrands] = useState<IBrand[]>([]);
	const [essences, setEssences] = useState<IEssence[]>([]);
	const [emotions, setEmotions] = useState<IAssociatedEmotion[]>([]);

	const [buttonLoading, setButtonLoading] = useState(false);
	const [submitDisable, setSubmitDisable] = useState(true);

	const [errors, setErrors] = useState({
		name: '',
		description: '',
		price: '',
		stock: '',
		category: '',
	});
	const [touched, setTouched] = useState({
		name: false,
		description: false,
		price: false,
		stock: false,
		category: false,
	});

	useEffect(() => {
		const loadFormData = async () => {
			try {
				const [catRes, colorRes, brandRes, essenceRes, emotionRes] =
					await Promise.all([
						categoriesGetService.getCategories(),
						colorsGetService.getColors(),
						brandsGetService.getBrands(),
						essencesGetService.getEssences(),
						associatedEmotionsGetService.getAssociatedEmotions(),
					]);
				if (catRes) setCategories(catRes);
				if (colorRes) setColors(colorRes);
				if (brandRes) setBrands(brandRes);
				if (essenceRes) setEssences(essenceRes);
				if (emotionRes) setEmotions(emotionRes);
			} catch (error) {
				console.error('Error fetching form data:', error);
				toast.error('Error al cargar datos.');
			}
		};
		loadFormData();
	}, []);

	useEffect(() => {
		const validationErrors = validateProductForm(product);
		setErrors(validationErrors);
	}, [product]);

	useEffect(() => {
		const hasErrors = Object.values(errors).some((error) => error !== '');
		const initialRequiredEmpty =
			!product.name || !product.price || !product.category;
		setSubmitDisable(hasErrors || initialRequiredEmpty);
	}, [errors, product]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		const numberFields = ['price', 'stock'];
		setProduct((prev) => ({
			...prev,
			[name]: numberFields.includes(name) ? Number(value) || 0 : value,
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

	const handleCategoryChange = (categoryId: string) => {
		setTouched((prev) => ({ ...prev, category: true }));
		setProduct((prev) => ({
			...prev,
			category: categoryId,
			subCategory: '',
		}));
		const selectedCategory = categories.find(
			(cat) => cat._id === categoryId
		);
		setSubCategories(
			selectedCategory ? selectedCategory.subCategories : []
		);
	};

	const handleSelectChange = (name: keyof IProductForm, value: string) => {
		setTouched((prev) => ({
			...prev,
			[name as keyof typeof touched]: true,
		}));
		setProduct((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validationErrors = validateProductForm(product);
		const hasErrors = Object.values(validationErrors).some((e) => e !== '');

		if (hasErrors) {
			setTouched({
				name: true,
				description: true,
				price: true,
				stock: true,
				category: true,
			});
			setErrors(validationErrors);
			toast.error('Por favor, corrige los errores en el formulario.');
			return;
		}

		setButtonLoading(true);
		try {
			const uploadedImages = await uploadToCloudinary(
				imageFiles,
				'Productos',
				product
			);
			const validImages = uploadedImages.filter(
				(url): url is string => url !== null
			);
			const payload: Partial<IProductForm> = {
				name: product.name,
				price: product.price,
				category: product.category,
				stock: product.stock,
			};

			if (product.subCategory) payload.subCategory = product.subCategory;
			if (product.description) payload.description = product.description;
			if (product.images) payload.images = validImages;
			if (product.color) payload.color = product.color;
			if (product.essence) payload.essence = product.essence;
			if (product.associatedEmotion)
				payload.associatedEmotion = product.associatedEmotion;
			if (product.brand) payload.brand = product.brand;
			await postProduct(payload);
			toast.success('Producto creado con éxito');
			setProduct(initialState);
			setImageFiles([]);
			setTouched({
				name: false,
				description: false,
				price: false,
				stock: false,
				category: false,
			});
		} catch (error) {
			console.error('Error creating product:', error);
			toast.error('Error al crear el producto');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-4xl mx-auto my-8'>
			<CardHeader>
				<CardTitle className='text-center text-2xl font-bold'>
					Crear Nuevo Producto
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid gap-1.5'>
						<label htmlFor='name'>Nombre del Producto</label>
						<Input
							id='name'
							name='name'
							value={product.name}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Ej: Vela Aromática de Lavanda'
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
						<label htmlFor='description'>Descripción</label>
						<Textarea
							id='description'
							name='description'
							value={product.description}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder='Describe el producto...'
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
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='category'>Categoría</label>
							<Select
								onValueChange={handleCategoryChange}
								value={product.category}>
								<SelectTrigger
									id='category'
									className={`w-3/4 ${
										touched.category && errors.category
											? 'border-red-500 focus-visible:ring-red-500'
											: ''
									}`}>
									<SelectValue placeholder='Seleccioná un item' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='null'>
										Seleccioná un item
									</SelectItem>
									{categories.map((c) => (
										<SelectItem key={c._id} value={c._id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{touched.category && errors.category && (
								<p className='text-sm text-red-600 mt-1'>
									{errors.category}
								</p>
							)}
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='subCategory'>Sub-Categoría</label>
							<Select
								onValueChange={(v) =>
									handleSelectChange('subCategory', v)
								}
								value={product.subCategory}
								disabled={
									!product.category ||
									subCategories.length === 0
								}>
								<SelectTrigger
									id='subCategory'
									className='w-3/4'>
									<SelectValue placeholder='Seleccioná un item' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='null'>
										Seleccioná un item
									</SelectItem>
									{subCategories.map((sc) => (
										<SelectItem key={sc._id} value={sc._id}>
											{sc.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='brand'>Marca</label>
							<Select
								onValueChange={(v) =>
									handleSelectChange('brand', v)
								}
								value={product.brand}>
								<SelectTrigger id='brand' className='w-3/4'>
									<SelectValue placeholder='Seleccioná un item' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='null'>
										Seleccioná un item
									</SelectItem>
									{brands.map((b) => (
										<SelectItem key={b._id} value={b._id}>
											{b.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='color'>Color</label>
							<Select
								onValueChange={(v) =>
									handleSelectChange('color', v)
								}
								value={product.color}>
								<SelectTrigger id='color' className='w-3/4'>
									<SelectValue placeholder='Seleccioná un item' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='null'>
										Seleccioná un item
									</SelectItem>
									{colors.map((c) => (
										<SelectItem key={c._id} value={c._id}>
											<div className='flex items-center gap-2'>
												<span
													className='h-4 w-4 rounded-full'
													style={{
														backgroundColor: c.hex,
													}}
												/>
												{c.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='essences'>Esencia Principal</label>
							<Select
								onValueChange={(v) =>
									handleSelectChange('essence', v)
								}
								value={product.essence}>
								<SelectTrigger id='essences' className='w-3/4'>
									<SelectValue placeholder='Seleccioná un item' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='null'>
										Seleccioná un item
									</SelectItem>
									{essences.map((e) => (
										<SelectItem key={e._id} value={e._id}>
											{e.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-1.5'>
							<label htmlFor='associatedEmotion'>
								Emoción Asociada
							</label>
							<Select
								onValueChange={(v) =>
									handleSelectChange('associatedEmotion', v)
								}
								value={product.associatedEmotion}>
								<SelectTrigger
									id='associatedEmotion'
									className='w-3/4'>
									<SelectValue placeholder='Seleccioná un item' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='null'>
										Seleccioná un item
									</SelectItem>
									{emotions.map((e) => (
										<SelectItem key={e._id} value={e._id}>
											{e.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='grid gap-1.5'>
							<label htmlFor='price'>Precio</label>
							<Input
								id='price'
								name='price'
								type='number'
								value={product.price || ''}
								onChange={handleChange}
								onBlur={handleBlur}
								placeholder='0.00'
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
						<div className='grid gap-1.5'>
							<label htmlFor='stock'>Stock</label>
							<Input
								id='stock'
								name='stock'
								type='number'
								value={product.stock || ''}
								onChange={handleChange}
								onBlur={handleBlur}
								placeholder='0'
								className={
									touched.stock && errors.stock
										? 'border-red-500 focus-visible:ring-red-500'
										: ''
								}
							/>
							{touched.stock && errors.stock && (
								<p className='text-sm text-red-600 mt-1'>
									{errors.stock}
								</p>
							)}
						</div>
					</div>
					<div className='w-full flex justify-center'>
						<UploadImage
							setUrl={setImageFiles}
							form={product}
							imageFiles={imageFiles}
							customStyle='md:w-2/4'
						/>
					</div>
					<div className='w-full flex justify-center'>
						<Button
							type='submit'
							className='w-3/12 bg-aromas_pink text-aromas_gray_text'
							disabled={submitDisable || buttonLoading}>
							{buttonLoading && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{buttonLoading ? 'Creando...' : 'Crear Producto'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateProduct;
