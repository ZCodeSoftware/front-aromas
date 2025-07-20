import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
import TableSkeleton from '../../TableSkeleton';
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import { colorsGetService } from '@/services/catalogs/colors/GET/colors.service.get';
import UpdateColor from '../updateCatalogs/UpdateColor';

const ColorsList = () => {
	const [loading, setLoading] = useState(true);
	const [colorsData, setColorsData] = useState<IColor[]>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedColor, setSelectedColor] = useState<IColor | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await colorsGetService.getColors();
			if (result) {
				setColorsData(result);
			}
		} catch (error) {
			console.error('Error fetching brands:', error);
			toast.error('No se pudieron cargar las marcas.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (color: IColor) => {
		setSelectedColor(color);
		setOpenUpdateModal(true);
	};

	if (loading) {
		return <TableSkeleton />;
	}

	return (
		<>
			<div className='w-full p-4'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead className='text-center'>Color</TableHead>
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{colorsData.map((colors) => (
							<TableRow key={colors._id}>
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
			</div>
			{selectedColor && (
				<UpdateColor
					data={selectedColor}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedColor._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default ColorsList;
