import { useState } from 'react';
import { Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import { promotionsGetService } from '@/services/promotions/GET/promotions.service.get';
import { putPromotion } from '@/services/promotions/PUT/promotions.service.put';
import type { IPromotionData } from '@/services/promotions/models/promotions.interface';
import { useActiveRecordsList } from '@/pages/dashboard/hooks/useActiveRecordsList';
import ShowInactiveToggle from '../../ShowInactiveToggle';
import TableSkeleton from '../../TableSkeleton';
import UpdatePromotion from '../updatePromotion/UpdatePromotion';

const SCOPE_LABEL: Record<IPromotionData['scope'], string> = {
	ALL: 'Todo el catálogo',
	CATEGORY: 'Categorías',
	SUBCATEGORY: 'Sub-categorías',
	PRODUCTS: 'Productos',
	COMBOS: 'Combos',
};

const formatDate = (value: string | null) =>
	value ? new Date(value).toLocaleDateString('es-AR') : null;

/** "Desde X hasta Y", "Hasta Y", "Desde X", or "Sin vencimiento". */
const formatWindow = (promotion: IPromotionData): string => {
	const from = formatDate(promotion.startsAt);
	const to = formatDate(promotion.endsAt);

	if (from && to) return `${from} → ${to}`;
	if (to) return `Hasta ${to}`;
	if (from) return `Desde ${from}`;

	return 'Sin vencimiento';
};

/** The lists come back populated, so the row can name what the promotion reaches. */
const scopeTargets = (promotion: IPromotionData) =>
	[
		...promotion.categories,
		...promotion.subCategories,
		...promotion.products,
		...promotion.combos,
	].map((item) => item.name);

const isExpired = (promotion: IPromotionData): boolean =>
	!!promotion.endsAt && new Date(promotion.endsAt) < new Date();

const PromotionsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedPromotion, setSelectedPromotion] =
		useState<IPromotionData | null>(null);

	const {
		items: promotions,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IPromotionData>({
		fetchItems: async (includeInactive) => {
			const result = includeInactive
				? await promotionsGetService.getPromotionsIncludingInactive()
				: await promotionsGetService.getPromotions();
			return result?.data ?? [];
		},
		setItemActive: async (id, isActive) => {
			await putPromotion(id, { isActive });
		},
		loadErrorMessage: 'No se pudieron cargar las promociones.',
		toggleErrorMessage: 'No se pudo actualizar el estado de la promoción.',
	});

	const handleEditClick = (promotion: IPromotionData) => {
		setSelectedPromotion(promotion);
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
					<Table data-tutorial='promotions-table'>
						<TableHeader>
							<TableRow>
								<TableHead>Nombre</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Alcance</TableHead>
								<TableHead className='text-right'>Descuento</TableHead>
								<TableHead>Vigencia</TableHead>
								<TableHead className='text-right'>Usos</TableHead>
								<TableHead className='text-right'>Activa</TableHead>
								<TableHead className='text-right'>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{promotions.map((promotion) => {
								const targets = scopeTargets(promotion);
								const expired = isExpired(promotion);
								const exhausted =
									!!promotion.usageLimit &&
									promotion.usedCount >= promotion.usageLimit;

								return (
									<TableRow
										key={promotion._id}
										className={
											promotion.isActive ? '' : 'opacity-50'
										}>
										<TableCell className='font-medium'>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className='cursor-help border-b border-dashed border-gray-400'>
														{promotion.name}
													</span>
												</TooltipTrigger>
												<TooltipContent className='bg-white'>
													<p className='max-w-sm text-sm'>
														{promotion.description ||
															'Sin descripción'}
													</p>
												</TooltipContent>
											</Tooltip>
										</TableCell>
										<TableCell>
											{promotion.code ? (
												<Badge className='bg-aromas_fucsia text-white'>
													{promotion.code}
												</Badge>
											) : (
												<span className='text-aromas_gray_text'>
													Automática
												</span>
											)}
										</TableCell>
										<TableCell>
											{targets.length ? (
												<Tooltip>
													<TooltipTrigger asChild>
														<span className='cursor-help border-b border-dashed border-gray-400'>
															{`${SCOPE_LABEL[promotion.scope]} (${targets.length})`}
														</span>
													</TooltipTrigger>
													<TooltipContent className='bg-white'>
														<p className='max-w-sm text-sm'>
															{targets.join(', ')}
														</p>
													</TooltipContent>
												</Tooltip>
											) : (
												SCOPE_LABEL[promotion.scope]
											)}
										</TableCell>
										<TableCell className='text-right font-semibold text-aromas_fucsia'>
											{promotion.valueType === 'PERCENTAGE'
												? `${promotion.value}%`
												: `$${promotion.value.toFixed(2)}`}
										</TableCell>
										<TableCell
											className={
												expired
													? 'font-semibold text-red-600'
													: ''
											}>
											{formatWindow(promotion)}
											{expired && ' (vencida)'}
										</TableCell>
										<TableCell
											className={`text-right ${exhausted ? 'font-semibold text-red-600' : ''}`}>
											{promotion.usageLimit
												? `${promotion.usedCount} / ${promotion.usageLimit}`
												: promotion.usedCount}
										</TableCell>
										<TableCell className='text-right'>
											<Switch
												className='bg-aromas_pink'
												checked={promotion.isActive}
												disabled={
													togglingId === promotion._id
												}
												onCheckedChange={() =>
													toggleActive(promotion)
												}
											/>
										</TableCell>
										<TableCell className='text-right'>
											<Button
												variant='ghost'
												size='icon'
												aria-label={`Editar ${promotion.name}`}
												onClick={() =>
													handleEditClick(promotion)
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
			{selectedPromotion && (
				<UpdatePromotion
					data={selectedPromotion}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedPromotion._id}
					onUpdate={refresh}
				/>
			)}
		</TooltipProvider>
	);
};

export default PromotionsList;
