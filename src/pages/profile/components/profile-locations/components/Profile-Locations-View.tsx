import { useState } from 'react';
import { toast } from 'sonner';
import { Edit, Home, PlusIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IProfileLocationsSubpagesProps } from '../models/profile-locations-subpages-props.interface';
import type { IAddress } from '@/services/address/models/address.interface';
import { addressDeleteService } from '@/services/address/DELETE/address.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';

interface ProfileLocationsViewProps extends IProfileLocationsSubpagesProps {
	addresses: IAddress[];
	loading: boolean;
	error: boolean;
	onRetry: () => void;
	onDeleted: () => void;
}

const ProfileLocationsView: React.FC<ProfileLocationsViewProps> = ({
	onNavigate,
	addresses,
	loading,
	error,
	onRetry,
	onDeleted,
}) => {
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (address: IAddress) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar "${address.name || address.street}"?`
		);
		if (!confirmed) return;

		setDeletingId(address._id);
		try {
			await addressDeleteService.deleteAddress(address._id);
			toast.success('Dirección eliminada con éxito.');
			onDeleted();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo eliminar la dirección.')
			);
		} finally {
			setDeletingId(null);
		}
	};
	return (
		<div className='px-4'>
			<div className='w-full flex justify-end mb-4'>
				<Button
					onClick={() => onNavigate('addressCreate')}
					className='bg-aromas_pink rounded-3xl text-white'>
					<PlusIcon className='mr-2' /> Agregar dirección
				</Button>
			</div>

			{loading && (
				<p className='text-center text-aromas_gray_text py-6'>
					Cargando tus direcciones...
				</p>
			)}

			{!loading && error && (
				<div className='flex flex-col items-center gap-y-3 py-6'>
					<p className='text-center text-sm text-red-600'>
						No pudimos cargar tus direcciones.
					</p>
					<button
						onClick={onRetry}
						className='text-sm font-semibold text-aromas_fucsia underline underline-offset-2'>
						Reintentar
					</button>
				</div>
			)}

			{!loading && !error && addresses.length === 0 && (
				<p className='text-center text-aromas_gray_text py-6'>
					Todavía no tenés direcciones guardadas.
				</p>
			)}

			{!loading &&
				!error &&
				addresses.map((address) => (
					<div
						key={address._id}
						className='flex items-center space-x-4 rounded-lg py-6 border-b border-aromas_gray_line last:border-none'>
						<div className='w-full flex'>
							<Home className='mx-2 text-aromas_fucsia flex-shrink-0 mt-1' />
							<div className='w-full flex justify-between px-2'>
								<div className='flex w-full flex-col'>
									<p className='text-aromas_gray_text font-bold'>
										{address.name || 'Dirección'}
									</p>
									<p className='text-aromas_gray_text'>{`${address.street} ${address.number ?? ''}`}</p>
									<p className='text-aromas_gray_text'>
										{`CP: ${address.zipCode}`}
									</p>
									{address.description && (
										<p className='text-aromas_gray_text'>
											{address.description}
										</p>
									)}
								</div>
								<div className='flex items-start space-x-4'>
									<button
										onClick={() =>
											onNavigate(
												'addressUpdate',
												address._id
											)
										}>
										<Edit
											size={23}
											className='text-aromas_fucsia'
										/>
									</button>
									<button
										onClick={() => handleDelete(address)}
										disabled={deletingId === address._id}
										className='disabled:opacity-50'>
										<Trash2
											size={23}
											className='text-red-600'
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default ProfileLocationsView;
