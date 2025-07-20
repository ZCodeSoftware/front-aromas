import axios, { isAxiosError } from 'axios';
import type { IProductForm } from '../dashboardProducts/createProduct/models/product-form.interface';
import { toast } from 'sonner';

const uploadToCloudinary = async (
	file: Blob[],
	folderName: string,
	form: IProductForm
) => {
	const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
	const uploadPreset = import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET;

	try {
		const shortFolderName = form.name.split(' ').slice(0, 3).join(' ');

		const uploadedUrls = await Promise.all(
			file.map(async (file) => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('upload_preset', uploadPreset);
				formData.append('folder', `${folderName}/${shortFolderName}`);

				const response = await axios.post(
					`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);
				return response.data.secure_url;
			})
		);

		return uploadedUrls;
	} catch (error: unknown) {
		console.error('Error al subir imágenes:', error);

		if (isAxiosError(error)) {
			console.log('Error response:', error.response?.data);

			if (
				error.response?.data?.error?.message?.includes(
					'File size too large'
				)
			) {
				toast.error(
					'El archivo es demasiado pesado. El tamaño máximo permitido es de 10 MB.'
				);
			} else {
				toast.error(
					'Error al subir imágenes. Por favor, inténtalo de nuevo.'
				);
			}
		} else {
			toast.error(
				'Ha ocurrido un error inesperado al subir las imágenes.'
			);
		}

		throw new Error('Error al subir imágenes');
	}
};

export default uploadToCloudinary;
