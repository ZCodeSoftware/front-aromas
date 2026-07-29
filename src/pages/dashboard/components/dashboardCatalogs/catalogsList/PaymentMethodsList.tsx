import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import TableSkeleton from '../../TableSkeleton';
import type { IPaymentMethod } from '@/services/catalogs/payment-method/models/payment-method.interface';
import { paymentMethodGetService } from '@/services/catalogs/payment-method/GET/payment-method.service.get';
import { paymentMethodDeleteService } from '@/services/catalogs/payment-method/DELETE/payment-method.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import UpdatePaymentMethod from '../updateCatalogs/UpdatePaymentMethod';
import CreatePaymentMethodDialog from '../createCatalogs/CreatePaymentMethodDialog';

const PaymentMethodsList = () => {
	const [loading, setLoading] = useState(true);
	const [paymentMethodsData, setPaymentMethodsData] = useState<
		IPaymentMethod[]
	>([]);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<IPaymentMethod | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await paymentMethodGetService.getPaymentMethods();
			if (result) {
				setPaymentMethodsData(result);
			}
		} catch (error) {
			console.error('Error fetching payment methods:', error);
			toast.error('No se pudieron cargar los métodos de pago.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (paymentMethod: IPaymentMethod) => {
		setSelectedPaymentMethod(paymentMethod);
		setOpenUpdateModal(true);
	};

	const handleDelete = async (paymentMethod: IPaymentMethod) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar "${paymentMethod.name}"?`
		);
		if (!confirmed) return;

		setDeletingId(paymentMethod._id);
		try {
			await paymentMethodDeleteService.deletePaymentMethod(
				paymentMethod._id
			);
			toast.success('Método de pago eliminado con éxito.');
			await getData();
		} catch (error) {
			toast.error(
				getApiErrorMessage(
					error,
					'No se pudo eliminar el método de pago.'
				)
			);
		} finally {
			setDeletingId(null);
		}
	};

	if (loading) {
		return <TableSkeleton />;
	}

	return (
		<>
			<div className='w-full p-4'>
				<div className='w-full flex justify-start mb-4'>
					<Button
						onClick={() => setOpenCreateModal(true)}
						className='bg-aromas_pink text-aromas_gray_text'>
						<Plus className='mr-2 h-4 w-4' />
						Crear
					</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paymentMethodsData.map((paymentMethod) => (
							<TableRow key={paymentMethod._id}>
								<TableCell className='font-medium'>
									{paymentMethod.name}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleEditClick(paymentMethod)
										}>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleDelete(paymentMethod)
										}
										disabled={
											deletingId === paymentMethod._id
										}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedPaymentMethod && (
				<UpdatePaymentMethod
					data={selectedPaymentMethod}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedPaymentMethod._id}
					onUpdate={getData}
				/>
			)}
			<CreatePaymentMethodDialog
				open={openCreateModal}
				setOpen={setOpenCreateModal}
				onCreated={getData}
			/>
		</>
	);
};

export default PaymentMethodsList;
