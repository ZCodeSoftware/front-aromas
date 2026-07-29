import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
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
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import { categoriesGetService } from '@/services/catalogs/categories/GET/categories.service.get';
import { categoriesDeleteService } from '@/services/catalogs/categories/DELETE/categories.service.delete';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import UpdateCategory from '../updateCatalogs/UpdateCategory';
import TableSkeleton from '../../TableSkeleton';

const CategoriesList = () => {
	const [loading, setLoading] = useState(true);
	const [categoriesData, setCategoriesData] = useState<ICategory[]>([]);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
		null
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const getData = async () => {
		setLoading(true);
		try {
			const result = await categoriesGetService.getCategories();
			if (result) {
				setCategoriesData(result);
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
			toast.error('No se pudieron cargar las categorías.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const handleEditClick = (category: ICategory) => {
		setSelectedCategory(category);
		setOpenUpdateModal(true);
	};

	const handleDelete = async (category: ICategory) => {
		const confirmed = window.confirm(
			`¿Seguro que querés eliminar "${category.name}"?`
		);
		if (!confirmed) return;

		setDeletingId(category._id);
		try {
			await categoriesDeleteService.deleteCategory(category._id);
			toast.success('Categoría eliminada con éxito.');
			getData();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo eliminar la categoría.')
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
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead className='text-center'>
								Sub-Categorías
							</TableHead>
							<TableHead className='text-right'>
								Acciones
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categoriesData.map((category) => (
							<TableRow key={category._id}>
								<TableCell className='font-medium'>
									{category.name}
								</TableCell>
								<TableCell className='fornt-medium text-center'>
									{category.subCategories &&
									category.subCategories.length > 0 ? (
										<Tooltip delayDuration={200}>
											<TooltipTrigger asChild>
												<div className='flex items-center justify-center'>
													{category.subCategories
														.slice(0, 2)
														.map((sub) => sub.name)
														.join(' , ')}
													{category.subCategories
														.length > 2 && (
														<span className='font-bold'>
															...
														</span>
													)}
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className='font-medium'>
													{category.subCategories
														.map((sub) => sub.name)
														.join(', ')}
												</p>
											</TooltipContent>
										</Tooltip>
									) : (
										<span className='text-gray-400'>-</span>
									)}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() =>
											handleEditClick(category)
										}>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										disabled={deletingId === category._id}
										onClick={() => handleDelete(category)}>
										<Trash2 className='h-4 w-4 text-red-600' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{selectedCategory && (
				<UpdateCategory
					data={selectedCategory}
					openUpdateModal={openUpdateModal}
					setOpenUpdateModal={setOpenUpdateModal}
					id={selectedCategory._id}
					onUpdate={getData}
				/>
			)}
		</>
	);
};

export default CategoriesList;
