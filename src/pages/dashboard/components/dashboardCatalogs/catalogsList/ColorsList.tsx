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
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import { colorsGetService } from '@/services/catalogs/colors/GET/colors.service.get';
import {
	getCatalogIncludingInactive,
	setCatalogItemActive,
} from '@/services/catalogs/catalog-status.service';
import UpdateColor from '../updateCatalogs/UpdateColor';

const ColorsList = () => {
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedColor, setSelectedColor] = useState<IColor | null>(null);

	const {
		items: colorsData,
		loading,
		showInactive,
		setShowInactive,
		togglingId,
		toggleActive,
		refresh,
	} = useActiveRecordsList<IColor>({
		fetchItems: (includeInactive) =>
			includeInactive
				? getCatalogIncludingInactive<IColor>('cat-color')
				: colorsGetService.getColors(),
		setItemActive: (id, isActive) =>
			setCatalogItemActive('cat-color', id, isActive),
		loadErrorMessage: 'No se pudieron cargar los colores.',
		toggleErrorMessage: 'No se pudo actualizar el estado del color.',
	});

	const handleEditClick = (color: IColor) => {
		setSelectedColor(color);
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
								<TableHead className='text-center'>Color</TableHead>
								<TableHead className='text-center'>Estado</TableHead>
								<TableHead className='text-right'>
									Acciones
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{colorsData.map((colors) => (
								<TableRow
									key={colors._id}
									className={colors.isActive ? '' : 'opacity-50'}>
									<TableCell className='font-medium'>
										{colors.name}
									</TableCell>
									<TableCell className='flex items-center justify-center font-medium'>
										<Button
											disabled
											className='rounded-full w-9 min-h-full'
											style={{
												backgroundColor: colors.hex,
											}}></Button>
									</TableCell>
									<TableCell className='text-center'>
										<Switch
											checked={colors.isActive}
											disabled={togglingId === colors._id}
											onCheckedChange={() =>
												toggleActive(colors)
											}
										/>
									</TableCell>
									<TableCell className='text-right'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => handleEditClick(colors)}>
											<Pencil className='h-4 w-4' />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
			{selectedColor && (
				<UpdateColor
					data={selectedColor}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedColor._id}
					onUpdate={refresh}
				/>
			)}
		</>
	);
};

export default ColorsList;
