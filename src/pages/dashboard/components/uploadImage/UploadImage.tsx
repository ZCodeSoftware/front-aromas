import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import ImageCrop from './utils/ImageCrop';
import type { IProductForm } from '../dashboardProducts/createProduct/models/product-form.interface';
import type { IPreset } from './models/upload-image-preset.interface';

interface CroppedFilesState {
	croppedImages: Blob[];
}
type FormTypes = IProductForm;
interface FilePreview {
	file: File | Blob;
	preview: string;
	size: string;
	id: string;
}

const UploadImage = <T extends FormTypes>({
	setUrl,
	form,
	handleMouseEnter,
	handleMouseLeave,
	imageFiles,
	isMultiple = true,
	customStyle,
}: IPreset<T>) => {
	const [isInputShow, setInputShow] = useState(false);
	const [croppingFiles, setCroppingFiles] = useState<File[]>([]);
	const [error, setError] = useState<string>('');
	const [croppedFiles, setCroppedFiles] = useState<CroppedFilesState>({
		croppedImages: [],
	});
	const [resizeConfirmModal, setResizeConfirmModal] = useState(false);
	const [largeFiles, setLargeFiles] = useState<File[]>([]);
	const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
	const MAX_FILE_SIZE = 10 * 1024 * 1024;

	const generateUniqueId = (): string =>
		Date.now().toString(36) + Math.random().toString(36).substring(2);

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const validateFiles = (
		files: File[]
	): { validFiles: File[]; oversizedFiles: File[] } => {
		if (!isMultiple && imageFiles.length + files.length > 1) {
			setError('Solo se permite subir una imagen');
			return { validFiles: [], oversizedFiles: [] };
		}
		const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);
		const oversizedFiles = files.filter(
			(file) => file.size > MAX_FILE_SIZE
		);
		if (oversizedFiles.length > 0) {
			setLargeFiles(oversizedFiles);
			setResizeConfirmModal(true);
		}
		setError('');
		return { validFiles, oversizedFiles };
	};

	const resizeImage = (
		file: File,
		maxDimension: number,
		quality: number = 0.9
	): Promise<File> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');
					if (!ctx) {
						reject(
							new Error(
								'No se pudo obtener el contexto del canvas'
							)
						);
						return;
					}
					const { width, height } = img;
					const scaleFactor = Math.min(
						maxDimension / width,
						maxDimension / height,
						1
					);
					canvas.width = Math.round(width * scaleFactor);
					canvas.height = Math.round(height * scaleFactor);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob(
						(blob) => {
							if (blob) {
								resolve(
									new File([blob], file.name, {
										type: file.type,
									})
								);
							} else {
								reject(
									new Error(
										'No se pudo crear el Blob a partir del canvas'
									)
								);
							}
						},
						file.type,
						quality
					);
				};
				if (event.target?.result) {
					img.src = event.target.result as string;
				}
			};
			reader.onerror = () =>
				reject(new Error('Error al leer el archivo'));
			reader.readAsDataURL(file);
		});
	};

	const createFilePreviews = useCallback((files: (File | Blob)[]) => {
		const newPreviews = files.map((file) => {
			return {
				file,
				preview: URL.createObjectURL(file),
				size: formatFileSize(file.size),
				id: generateUniqueId(),
			};
		});
		setFilePreviews((prev) => [...prev, ...newPreviews]);
	}, []);

	const compressLargeFiles = async () => {
		try {
			const compressedFiles = await Promise.all(
				largeFiles.map((file) => resizeImage(file, 1280, 0.7))
			);
			const stillTooLarge = compressedFiles.filter(
				(f) => f.size > MAX_FILE_SIZE
			);
			const okFiles = compressedFiles.filter(
				(f) => f.size <= MAX_FILE_SIZE
			);

			if (stillTooLarge.length > 0) {
				toast.warning(
					`${stillTooLarge.length} archivo(s) siguen siendo demasiado grandes y no se agregarán.`
				);
			}

			if (okFiles.length > 0) {
				setCroppingFiles((prev) => [...prev, ...okFiles]);
				toast.success(
					'Archivos redimensionados y listos para recortar.'
				);
			}
			setResizeConfirmModal(false);
			setLargeFiles([]);
		} catch (error) {
			console.error('Error al comprimir archivos:', error);
			toast.error('Error al redimensionar los archivos');
		}
	};

	const processFiles = (files: File[]) => {
		const { validFiles } = validateFiles(files);
		if (validFiles.length > 0) {
			setCroppingFiles((prev) => [...prev, ...validFiles]);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files) {
			processFiles(Array.from(e.target.files));
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files) {
			processFiles(Array.from(e.dataTransfer.files));
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
		e.preventDefault();

	useEffect(() => {
		if (croppedFiles.croppedImages.length > 0) {
			if (
				!isMultiple &&
				imageFiles.length + croppedFiles.croppedImages.length > 1
			) {
				setError('Solo se permite subir una imagen');
				setCroppedFiles({ croppedImages: [] });
				return;
			}
			setUrl((prev) => [...prev, ...croppedFiles.croppedImages]);
			createFilePreviews(croppedFiles.croppedImages);
			setCroppedFiles({ croppedImages: [] });
		}
	}, [
		croppedFiles,
		createFilePreviews,
		imageFiles.length,
		isMultiple,
		setUrl,
	]);

	const handleCropComplete = (croppedImages: Blob[]) => {
		setCroppedFiles({ croppedImages });
		setCroppingFiles([]);
	};

	const handleCropCancel = () => {
		setCroppingFiles([]);
	};

	const handleImageChargeCancel = () => {
		setCroppedFiles({ croppedImages: [] });
		setUrl([]);
		setFilePreviews([]);
		setInputShow(false);
		setError('');
	};

	const removeFilePreview = (fileId: string) => {
		const fileToRemove = filePreviews.find((f) => f.id === fileId);
		if (!fileToRemove) return;

		setFilePreviews((prev) => prev.filter((item) => item.id !== fileId));
		setUrl((prev) => prev.filter((file) => file !== fileToRemove.file));
	};

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className='w-full flex flex-col items-center'>
			<Button
				type='button'
				onClick={() => setInputShow(true)}
				className={`${
					isInputShow && 'hidden'
				} border border-aromas_fucsia text-aromas_fucsia`}>
				Cargar imágenes
			</Button>

			{isInputShow && (
				<>
					{form.name ? (
						<div
							className='flex flex-col items-center justify-center w-full'
							onDrop={handleDrop}
							onDragOver={handleDragOver}>
							<label
								htmlFor='dropzone-file'
								className='flex flex-col items-center justify-center w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
								<div className='flex flex-col items-center justify-center pt-5 pb-6 h-full'>
									<UploadCloud className='w-8 h-8 mb-4 text-gray-500' />
									<p className='mb-2 text-sm text-gray-500'>
										<span className='font-semibold'>
											Click para subir
										</span>{' '}
										o arrastra aquí
									</p>
									<p className='text-xs text-gray-500'>
										{isMultiple
											? 'Puedes seleccionar múltiples archivos'
											: 'Solo puedes seleccionar una imagen'}
									</p>
									<p className='text-xs text-gray-500 mt-2 font-semibold'>
										Seleccionados: {imageFiles.length}{' '}
										archivo/s
									</p>
									<p className='text-xs text-gray-400 mt-1'>
										Proporción 16:9 (Max 10MB)
									</p>
								</div>
								<Input
									id='dropzone-file'
									type='file'
									className='hidden'
									onChange={handleFileChange}
									multiple={isMultiple}
									accept='image/*'
								/>

								{error && (
									<p className='text-red-500 text-sm mb-2'>
										{error}
									</p>
								)}

								{filePreviews.length > 0 && (
									<div className='w-full p-4 border-t mt-4'>
										<h3 className='text-md font-semibold mb-3'>
											Vista previa:
										</h3>
										<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
											{filePreviews.map((item) => (
												<div
													key={item.id}
													className='relative border rounded-md overflow-hidden group'>
													<img
														src={item.preview}
														alt={`Preview`}
														className='h-32 w-full object-cover'
													/>
													<div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1'>
														<p className='truncate'>
															{item.file instanceof
															File
																? item.file.name
																: `Image`}
														</p>
														<p>{item.size}</p>
													</div>
													<Button
														variant='destructive'
														size='icon'
														className='absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 bg-red-500'
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															removeFilePreview(
																item.id
															);
														}}>
														<X className='h-4 w-4' />
													</Button>
												</div>
											))}
										</div>
									</div>
								)}
								<div className='w-full cursor-default flex items-end justify-around p-2'>
									<Button
										type='button'
										variant='outline'
										className='border-aromas_fucsia text-aromas_fucsia'
										onClick={handleImageChargeCancel}>
										Cancelar Carga
									</Button>
								</div>
							</label>
						</div>
					) : (
						<span className='text-red-600 text-xs block mt-1'>
							Debes agregar un nombre al producto antes de cargar
							imágenes
						</span>
					)}
				</>
			)}

			<Dialog
				open={resizeConfirmModal}
				onOpenChange={setResizeConfirmModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Archivo(s) demasiado grande(s)
						</DialogTitle>
						<DialogDescription>
							{largeFiles.length === 1
								? 'El archivo seleccionado excede el límite de 10MB.'
								: `${largeFiles.length} archivos exceden el límite de 10MB.`}
							<br />
							¿Deseas redimensionar automáticamente para reducir
							el tamaño?
						</DialogDescription>
					</DialogHeader>
					<div className='mt-3'>
						<h4 className='font-semibold'>
							Archivos a redimensionar:
						</h4>
						<ul className='list-disc ml-5 mt-1 text-sm'>
							{largeFiles.map((file, index) => (
								<li key={index}>
									{file.name} ({formatFileSize(file.size)})
								</li>
							))}
						</ul>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								variant='outline'
								onClick={() => setLargeFiles([])}>
								Cancelar
							</Button>
						</DialogClose>
						<Button onClick={compressLargeFiles}>
							Redimensionar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{croppingFiles.length > 0 && (
				<ImageCrop
					files={croppingFiles}
					onCropComplete={handleCropComplete}
					onCancel={handleCropCancel}
					aspectRatio={16 / 9}
					customStyle={customStyle}
				/>
			)}
		</div>
	);
};

export default UploadImage;
