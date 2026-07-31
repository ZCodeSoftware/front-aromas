import { useState } from 'react';
import { AlertTriangle, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { combosGetService } from '@/services/combos/GET/combos.service.get';
import { putCombo } from '@/services/combos/PUT/combos.service.put';
import type { IComboData } from '@/services/combos/models/combos.interface';
import { useActiveRecordsList } from '@/pages/dashboard/hooks/useActiveRecordsList';
import ShowInactiveToggle from '../../ShowInactiveToggle';
import TableSkeleton from '../../TableSkeleton';
import UpdateCombo from '../updateCombo/UpdateCombo';

const CombosList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedCombo, setSelectedCombo] = useState<IComboData | null>(null);

	const {
		items: combos,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IComboData>({
		fetchItems: async (includeInactive) => {
			const result = includeInactive
				? await combosGetService.getCombosIncludingInactive()
				: await combosGetService.getCombos();
			return result?.data ?? [];
		},
		setItemActive: async (id, isActive) => {
			await putCombo(id, { isActive });
		},
		loadErrorMessage: 'No se pudieron cargar los combos.',
		toggleErrorMessage: 'No se pudo actualizar el estado del combo.',
	});

	const handleEditClick = (combo: IComboData) => {
		setSelectedCombo(combo);
		setOpenUpdateModal(true);
	};

	return (
		<TooltipProvider>
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
					<Table data-tutorial='combos-table'>
						<TableHeader>
							<TableRow>
								<TableHead>Nombre</TableHead>
								<TableHead>Productos</TableHead>
								<TableHead className='text-right'>
									Precio sin combo
								</TableHead>
								<TableHead className='text-right'>Precio</TableHead>
								<TableHead className='text-right'>Ahorro</TableHead>
								<TableHead className='text-right'>Stock</TableHead>
								<TableHead className='text-right'>Activo</TableHead>
								<TableHead className='text-right'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{combos.map((combo) => {
								// A deactivated product does not deactivate the combo:
								// it just drops its stock to zero, so the row has to
								// say why it cannot be sold.
								const hasUnavailableComponent = combo.items.some(
									(item) => !item.product?.isActive
								);

								return (
									<TableRow
										key={combo._id}
										className={
											combo.isActive ? '' : 'opacity-50'
										}>
										<TableCell className='font-medium'>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className='cursor-help border-b border-dashed border-gray-400'>
														{combo.name}
													</span>
												</TooltipTrigger>
												<TooltipContent className='bg-white'>
													<p className='max-w-sm text-sm'>
														{combo.description ||
															'Sin descripción'}
													</p>
												</TooltipContent>
											</Tooltip>
										</TableCell>
										<TableCell>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className='inline-flex items-center gap-1 cursor-help border-b border-dashed border-gray-400'>
														{`${combo.items.length} producto(s)`}
														{hasUnavailableComponent && (
															<AlertTriangle className='h-4 w-4 text-red-600' />
														)}
													</span>
												</TooltipTrigger>
												<TooltipContent className='bg-white'>
													<ul className='max-w-sm text-sm'>
														{combo.items.map((item) => (
															<li
																key={
																	item.product
																		?._id
																}>
																{`${item.quantity} x ${item.product?.name ?? 'Producto eliminado'}`}
																{item.product &&
																	!item.product
																		.isActive &&
																	' (desactivado)'}
															</li>
														))}
													</ul>
												</TooltipContent>
											</Tooltip>
										</TableCell>
										<TableCell className='text-right text-aromas_gray_text'>
											<s>
												${combo.compareAtPrice.toFixed(2)}
											</s>
										</TableCell>
										<TableCell className='text-right font-semibold text-aromas_fucsia'>
											${combo.price.toFixed(2)}
										</TableCell>
										<TableCell className='text-right'>
											{combo.savings > 0
												? `$${combo.savings.toFixed(2)}`
												: '—'}
										</TableCell>
										<TableCell
											className={`text-right ${combo.stock === 0 ? 'font-semibold text-red-600' : ''}`}>
											{combo.stock}
										</TableCell>
										<TableCell className='text-right'>
											<Switch
												className='bg-aromas_pink'
												checked={combo.isActive}
												disabled={togglingId === combo._id}
												onCheckedChange={() =>
													toggleActive(combo)
												}
											/>
										</TableCell>
										<TableCell className='text-right'>
											<Button
												variant='ghost'
												size='icon'
												aria-label={`Editar ${combo.name}`}
												onClick={() =>
													handleEditClick(combo)
												}>
												<Pencil className='h-4 w-4' />
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedCombo && (
				<UpdateCombo
					data={selectedCombo}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedCombo._id}
					onUpdate={refresh}
				/>
			)}
		</TooltipProvider>
	);
};

export default CombosList;
