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
import type { IBrand } from '@/services/catalogs/brand/models/brands.interface';
import { brandsGetService } from '@/services/catalogs/brand/GET/brands.service.get';
import UpdateBrand from '../updateCatalogs/UpdateBrand';

const BrandsList = () => {
	const [loading, setLoading] = useState(true);
	const [brandsData, setBrandsData] = useState<IBrand[]>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await brandsGetService.getBrands();
			if (result) {
				setBrandsData(result);
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

	const handleEditClick = (brand: IBrand) => {
		setSelectedBrand(brand);
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
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{brandsData.map((brands) => (
							<TableRow key={brands._id}>
								<TableCell className='font-medium'>
									{brands.name}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => handleEditClick(brands)}>
										<Pencil className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedBrand && (
				<UpdateBrand
					data={selectedBrand}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedBrand._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default BrandsList;
