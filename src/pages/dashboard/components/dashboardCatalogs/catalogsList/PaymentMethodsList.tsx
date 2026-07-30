import { useState } from 'react';
import { Pencil } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import TableSkeleton from '../../TableSkeleton';
import ShowInactiveToggle from '../../ShowInactiveToggle';
import { useActiveRecordsList } from '@/pages/dashboard/hooks/useActiveRecordsList';
import type { IPaymentMethod } from '@/services/catalogs/payment-method/models/payment-method.interface';
import { paymentMethodGetService } from '@/services/catalogs/payment-method/GET/payment-method.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdatePaymentMethod from '../updateCatalogs/UpdatePaymentMethod';

const PaymentMethodsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<IPaymentMethod | null>(null);

	const {
		items: paymentMethodsData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IPaymentMethod>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<IPaymentMethod>(
						'cat-payment-method'
				  )
				: paymentMethodGetService.getPaymentMethods(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-payment-method', id, isActive),
		loadErrorMessage: 'No se pudieron cargar los métodos de pago.',
		toggleErrorMessage:
			'No se pudo actualizar el estado del método de pago.',
	});

	const handleEditClick = (paymentMethod: IPaymentMethod) => {
		setSelectedPaymentMethod(paymentMethod);
		setOpenUpdateModal(true);
	};

	return (
		<>
			<div className='w-full p-4'>
				<div className='w-full flex justify-end mb-4'>
					<ShowInactiveToggle
						checked={showInactive}
						onCheckedChange={setShowInactive}
					/>
				</div>
				{loading ? (
					<TableSkeleton />
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nombre</TableHead>
								<TableHead className='text-center'>Estado</TableHead>
								<TableHead className='text-right'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paymentMethodsData.map((paymentMethod) => (
								<TableRow
									key={paymentMethod._id}
									className={
										paymentMethod.isActive ? '' : 'opacity-50'
									}>
									<TableCell className='font-medium'>
										{paymentMethod.name}
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={paymentMethod.isActive}
											disabled={
												togglingId === paymentMethod._id
											}
											onCheckedChange={() =>
												toggleActive(paymentMethod)
											}
										/>
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
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedPaymentMethod && (
				<UpdatePaymentMethod
					data={selectedPaymentMethod}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedPaymentMethod._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default PaymentMethodsList;
