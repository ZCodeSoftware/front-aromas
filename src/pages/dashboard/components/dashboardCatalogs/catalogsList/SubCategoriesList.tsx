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
import { subCategoriesGetService } from '@/services/catalogs/sub-categories/GET/sub-categories.service.get';
import type { ISubCategory } from '@/services/catalogs/sub-categories/models/sub-categories.interface';
import UpdateSubCategory from '../updateCatalogs/UpdateSubCategory';

const SubCategoriesList = () => {
	const [loading, setLoading] = useState(true);
	const [subCategoriesData, setSubCategoriesData] = useState<ISubCategory[]>(
		[]
	);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedSubCategory, setSelectedSubCategory] =
		useState<ISubCategory | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await subCategoriesGetService.getSubCategories();
			if (result) {
				setSubCategoriesData(result);
			}
		} catch (error) {
			console.error('Error fetching sub-categories:', error);
			toast.error('No se pudieron cargar las sub-categorías.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (subCategory: ISubCategory) => {
		setSelectedSubCategory(subCategory);
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
						{subCategoriesData.map((subCategories) => (
							<TableRow key={subCategories._id}>
								<TableCell className='font-medium'>
									{subCategories.name}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleEditClick(subCategories)
										}>
										<Pencil className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedSubCategory && (
				<UpdateSubCategory
					data={selectedSubCategory}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedSubCategory._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default SubCategoriesList;
