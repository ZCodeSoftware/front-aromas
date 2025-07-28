import React, { useState, useCallback } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropProps {
	files: File[];
	onCropComplete: (croppedImages: Blob[]) => void;
	onCancel: () => void;
	aspectRatio: number;
	customStyle?: string;
}

const ImageCrop: React.FC<ImageCropProps> = ({
	files,
	onCropComplete,
	onCancel,
	aspectRatio,
	customStyle,
}) => {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
		null
	);
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const [croppedImages, setCroppedImages] = useState<Blob[]>([]);

	const onCropChange = (crop: Point) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom: number) => {
		setZoom(zoom);
	};

	const onCropCompleteCallback = useCallback(
		(_: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const createImage = useCallback(
		(url: string): Promise<HTMLImageElement> => {
			return new Promise((resolve, reject) => {
				const image = new Image();
				image.addEventListener('load', () => resolve(image));
				image.addEventListener('error', (error) => reject(error));
				image.setAttribute('crossOrigin', 'anonymous');
				image.src = url;
			});
		},
		[]
	);

	const getCroppedImg = useCallback(
		async (file: File, pixelCrop: Area): Promise<Blob> => {
			const image = await createImage(URL.createObjectURL(file));
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;

			canvas.width = pixelCrop.width;
			canvas.height = pixelCrop.height;

			ctx.drawImage(
				image,
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
				0,
				0,
				pixelCrop.width,
				pixelCrop.height
			);

			return new Promise((resolve, reject) => {
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(
								new Error(
									'No se pudo crear el blob de la imagen recortada.'
								)
							);
							return;
						}
						resolve(blob);
					},
					'image/jpeg',
					0.95
				);
			});
		},
		[createImage]
	);

	const showCroppedImage = useCallback(async () => {
		if (!croppedAreaPixels) {
			console.error('El área de recorte no está definida.');
			return;
		}

		try {
			const croppedImage = await getCroppedImg(
				files[currentFileIndex],
				croppedAreaPixels
			);

			if (croppedImage) {
				const newCroppedImages = [...croppedImages, croppedImage];
				if (currentFileIndex < files.length - 1) {
					setCroppedImages(newCroppedImages);
					setCurrentFileIndex(currentFileIndex + 1);
					setCrop({ x: 0, y: 0 });
					setZoom(1);
				} else {
					onCropComplete(newCroppedImages);
				}
			}
		} catch (error) {
			console.error('Error al recortar la imagen:', error);
		}
	}, [
		croppedAreaPixels,
		currentFileIndex,
		files,
		croppedImages,
		onCropComplete,
		getCroppedImg,
	]);

	const handleCancel = () => {
		onCancel();
	};

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50'>
			<div className='w-full h-screen flex flex-col justify-center items-center p-4'>
				<div
					className={`relative flex flex-col bg-aromas_nav_bg border border-b-none border-aromas_pink rounded-t-lg p-4 h-3/4 ${customStyle} w-full max-w-2xl`}>
					<div className='relative flex-grow bg-gray-900'>
						<Cropper
							image={URL.createObjectURL(files[currentFileIndex])}
							crop={crop}
							zoom={zoom}
							aspect={aspectRatio}
							onCropChange={onCropChange}
							onZoomChange={onZoomChange}
							onCropComplete={onCropCompleteCallback}
							minZoom={1}
							maxZoom={3}
							zoomSpeed={0.1}
						/>
					</div>
				</div>

				<div
					className={`rounded-b-lg p-4 flex flex-col gap-4 w-full max-w-2xl ${customStyle} bg-aromas_nav_bg`}>
					<div className='flex items-center gap-4 text-white'>
						<ZoomOut className='h-5 w-5' />
						<input
							type='range'
							value={zoom}
							min={1}
							max={3}
							step={0.01}
							aria-labelledby='Zoom'
							onChange={(e) => {
								onZoomChange(Number(e.target.value));
							}}
							className='w-full h-2 bg-aromas_pink rounded-lg appearance-none cursor-pointer accent-aromas_fucsia'
						/>
						<ZoomIn className='h-5 w-5' />
						<span className='w-16 text-center text-sm font-mono bg-aromas_pink text-aromas_gray_text rounded px-2 py-1'>
							{(zoom * 100).toFixed(0)}%
						</span>
						<Button
							size='icon'
							variant='outline'
							onClick={() => setZoom(1)}
							className='bg-transparent text-aromas_gray_text border-aromas_fucsia hover:bg-aromas_pink'>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
					<div className='flex justify-center items-center space-x-4'>
						<span className='text-white text-sm font-medium'>
							Imagen {currentFileIndex + 1} de {files.length}
						</span>
						<Button
							type='button'
							onClick={showCroppedImage}
							className='border text-aromas_gray_text bg-aromas_pink px-4 py-2 rounded'>
							{currentFileIndex < files.length - 1
								? 'Siguiente'
								: 'Finalizar y Aceptar'}
						</Button>
						<Button
							type='button'
							onClick={handleCancel}
							variant='outline'
							className='text-aromas_fucsia border-aromas_fucsia px-4 py-2 rounded'>
							{currentFileIndex < files.length - 1
								? 'Cancelar todo'
								: 'Cancelar'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageCrop;
