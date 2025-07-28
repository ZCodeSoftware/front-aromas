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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, X } from 'lucide-react';
import type { IUpdateProduct } from './models/update-product-props.interface';
import type { IProductForm } from '../createProduct/models/product-form.interface';
import { categoriesGetService } from '@/services/catalogs/categories/GET/categories.service.get';
import { brandsGetService } from '@/services/catalogs/brand/GET/brands.service.get';
import { colorsGetService } from '@/services/catalogs/colors/GET/colors.service.get';
import { essencesGetService } from '@/services/catalogs/essences/GET/essences.service.get';
import { associatedEmotionsGetService } from '@/services/catalogs/associated-emotions/GET/associated-emotions.service';
import { putProduct } from '@/services/products/PUT/products.service.put';
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary';
import UploadImage from '../../uploadImage/UploadImage';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import type { IBrand } from '@/services/catalogs/brand/models/brands.interface';
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import type { IAssociatedEmotion } from '@/services/catalogs/associated-emotions/models/associated-emotion.interface';
import { validateProductForm } from '../utils/productFromValidation/productFormValidation';

const UpdateProduct: React.FC<IUpdateProduct> = ({
	openUpdateModal,
	setOpenUpdateModal,
	productData,
	productId,
	onUpdate,
}) => {
	const [product, setProduct] = useState<IProductForm>({} as IProductForm);
	const [imageFiles, setImageFiles] = useState<Blob[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [subCategories, setSubCategories] = useState<
		ICategory['subCategories']
	>([]);
	const [brands, setBrands] = useState<IBrand[]>([]);
	const [colors, setColors] = useState<IColor[]>([]);
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
				toast.error('Error al cargar los datos para el formulario.');
			}
		};
		loadFormData();
	}, []);

	useEffect(() => {
		if (productData) {
			const initialProductState = {
				name: productData.name || '',
				price: productData.price || 0,
				description: productData.description || '',
				images: productData.images || [],
				color: productData.color?._id || '',
				category: productData.category?._id || '',
				subCategory: productData.subCategory?._id || '',
				essence: productData.essences?._id || '',
				associatedEmotion: productData.associatedEmotion?._id || '',
				brand: productData.brand?._id || '',
				isActive: productData.isActive ?? true,
				stock: productData.stock || 0,
			};
			setProduct(initialProductState);

			if (initialProductState.category && categories.length > 0) {
				const selectedCategory = categories.find(
					(cat) => cat._id === initialProductState.category
				);
				if (selectedCategory) {
					setSubCategories(selectedCategory.subCategories);
				}
			}
		}
	}, [productData, categories]);

	useEffect(() => {
		const validationErrors = validateProductForm(product);
		setErrors(validationErrors);
	}, [product]);

	useEffect(() => {
		const hasErrors = Object.values(errors).some((error) => error !== '');
		setSubmitDisable(hasErrors);
	}, [errors]);

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

	const handleDeleteExistingImage = (imageUrlToDelete: string) => {
		setProduct((prev) => ({
			...prev,
			images: prev.images.filter((img) => img !== imageUrlToDelete),
		}));
		toast.info(
			'Imagen marcada para eliminar. Guarda los cambios para confirmar.'
		);
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
			let finalImageUrls = product.images || [];
			if (imageFiles.length > 0) {
				const uploadedImages = await uploadToCloudinary(
					imageFiles,
					'Productos',
					product
				);
				const newImageUrls = uploadedImages.filter(
					(url): url is string => url !== null
				);
				finalImageUrls = [...finalImageUrls, ...newImageUrls];
			}
			const payload: Partial<IProductForm> = {
				name: product.name,
				price: product.price,
				category: product.category,
				stock: product.stock,
			};

			if (product.subCategory) payload.subCategory = product.subCategory;
			if (product.description) payload.description = product.description;
			if (product.images) payload.images = finalImageUrls;
			if (product.color) payload.color = product.color;
			if (product.essence) payload.essence = product.essence;
			if (product.associatedEmotion)
				payload.associatedEmotion = product.associatedEmotion;
			if (product.brand) payload.brand = product.brand;

			await putProduct(productId, payload);
			toast.success('Producto actualizado con éxito');
			onUpdate();
			setOpenUpdateModal(false);
		} catch (error) {
			console.error('Error updating product:', error);
			toast.error('Error al actualizar el producto');
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
			<DialogContent className='sm:max-w-3xl bg-white'>
				<DialogHeader>
					<DialogTitle>Modificar Producto</DialogTitle>
				</DialogHeader>
				<div className='max-h-[70vh] overflow-y-auto px-6'>
					<form
						id='update-product-form'
						onSubmit={handleSubmit}
						className='space-y-4 pt-4'>
						<div className='grid gap-1.5'>
							<label htmlFor='name'>Nombre</label>
							<Input
								id='name'
								name='name'
								value={product.name || ''}
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
							<label htmlFor='description'>Descripción</label>
							<Textarea
								id='description'
								name='description'
								value={product.description || ''}
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
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='grid gap-1.5'>
								<label htmlFor='category'>Categoría</label>
								<Select
									onValueChange={handleCategoryChange}
									value={product.category || ''}>
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
											Quitar selección
										</SelectItem>
										{categories.map((c) => (
											<SelectItem
												key={c._id}
												value={c._id}>
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
								<label htmlFor='subCategory'>
									Sub-Categoría
								</label>
								<Select
									onValueChange={(v) =>
										handleSelectChange('subCategory', v)
									}
									value={product.subCategory || ''}
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
											Quitar selección
										</SelectItem>
										{subCategories.map((sc) => (
											<SelectItem
												key={sc._id}
												value={sc._id}>
												{sc.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='grid gap-1.5'>
								<label htmlFor='brand'>Marca</label>
								<Select
									onValueChange={(v) =>
										handleSelectChange('brand', v)
									}
									value={product.brand || ''}>
									<SelectTrigger id='brand' className='w-3/4'>
										<SelectValue placeholder='Seleccioná un item' />
									</SelectTrigger>
									<SelectContent className='bg-white'>
										<SelectItem value='null'>
											Quitar selección
										</SelectItem>
										{brands.map((b) => (
											<SelectItem
												key={b._id}
												value={b._id}>
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
									value={product.color || ''}>
									<SelectTrigger id='color' className='w-3/4'>
										<SelectValue placeholder='Seleccioná un item' />
									</SelectTrigger>
									<SelectContent className='bg-white'>
										<SelectItem value='null'>
											Quitar selección
										</SelectItem>
										{colors.map((c) => (
											<SelectItem
												key={c._id}
												value={c._id}>
												<div className='flex items-center gap-2'>
													<span
														className='h-4 w-4 rounded-full'
														style={{
															backgroundColor:
																c.hex,
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
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='grid gap-1.5'>
								<label htmlFor='essences'>
									Esencia Principal
								</label>
								<Select
									onValueChange={(v) =>
										handleSelectChange('essence', v)
									}
									value={product.essence || ''}>
									<SelectTrigger
										id='essences'
										className='w-3/4'>
										<SelectValue placeholder='Seleccioná un item' />
									</SelectTrigger>
									<SelectContent className='bg-white'>
										<SelectItem value='null'>
											Quitar selección
										</SelectItem>
										{essences.map((e) => (
											<SelectItem
												key={e._id}
												value={e._id}>
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
										handleSelectChange(
											'associatedEmotion',
											v
										)
									}
									value={product.associatedEmotion || ''}>
									<SelectTrigger
										id='associatedEmotion'
										className='w-3/4'>
										<SelectValue placeholder='Seleccioná un item' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='null'>
											Quitar selección
										</SelectItem>
										{emotions.map((e) => (
											<SelectItem
												key={e._id}
												value={e._id}>
												{e.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='grid gap-1.5'>
								<label htmlFor='price'>Precio</label>
								<Input
									id='price'
									name='price'
									type='number'
									value={product.price || ''}
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
							<div className='grid gap-1.5'>
								<label htmlFor='stock'>Stock</label>
								<Input
									id='stock'
									name='stock'
									type='number'
									value={product.stock || ''}
									onChange={handleChange}
									onBlur={handleBlur}
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
					</form>
					<div className='grid grid-flow-col auto-cols-[128px] overflow-x-auto gap-4 py-2 mt-4'>
						{product?.images?.map((item, index) => (
							<div
								key={index}
								className='relative border rounded-md overflow-hidden group h-32'>
								<img
									src={item}
									alt={`Preview ${index}`}
									className='w-full h-full object-cover'
								/>
								<Button
									variant='destructive'
									size='icon'
									className='absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 bg-red-500'
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleDeleteExistingImage(item);
									}}>
									<X className='h-4 w-4' />
								</Button>
							</div>
						))}
					</div>
					<div className='w-full flex justify-center mt-4'>
						<UploadImage
							setUrl={setImageFiles}
							form={product}
							imageFiles={imageFiles}
							customStyle='md:w-full'
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type='button'
						onClick={() => setOpenUpdateModal(false)}
						variant='outline'
						className='border border-aromas_fucsia text-aromas_fucsia'>
						Cancelar
					</Button>
					<Button
						className='bg-aromas_pink text-aromas_gray_text'
						type='submit'
						form='update-product-form'
						disabled={submitDisable || buttonLoading}>
						{buttonLoading && (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						)}
						Guardar Cambios
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateProduct;
