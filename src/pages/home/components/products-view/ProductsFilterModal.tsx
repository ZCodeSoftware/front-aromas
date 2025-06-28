import { useState, useEffect, useRef } from 'react';
import type { IFilterOptions } from './models/product-filter.interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import type { IProductFilterModalProps } from './models/product-filter-props.interface';
import type { IFilterSectionProps } from './models/product-filter-section-props.interface';
import { categoriesGetService } from '@/services/catalogs/categories/GET/categories.service.get';
import type { ICategory } from '@/services/catalogs/categories/models/categories.interface';
import type { IColor } from '@/services/catalogs/colors/models/colors.interface';
import { colorsGetService } from '@/services/catalogs/colors/GET/colors.service.get';
import type { IEssence } from '@/services/catalogs/essences/models/essences.interface';
import { essencesGetService } from '@/services/catalogs/essences/GET/essences.service.get';
import { useClickOutside } from '@/hooks/useClickOutside';

const FilterSection: React.FC<IFilterSectionProps> = ({
	title,
	options,
	selected,
	onToggle,
	valueKey,
	labelKey,
}) => (
	<div className='mb-6'>
		<h3 className='text-md font-semibold text-gray-700 mb-3'>{title}</h3>
		<div className='flex flex-wrap gap-2'>
			{options.map((option, index) => {
				let value: string;
				let label: string;
				if (
					typeof option === 'object' &&
					option !== null &&
					valueKey &&
					labelKey
				) {
					value = option[valueKey];
					label = option[labelKey];
				} else {
					value = String(option);
					label = String(option);
				}
				return (
					<button
						key={`${value}-${index}`}
						onClick={() => onToggle(value)}
						className={`px-4 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
							selected.includes(value)
								? 'bg-pink border-fucsia text-black'
								: 'bg-white border-fucsia text-fucsia hover:bg-pink hover:text-black'
						}`}>
						{label}
					</button>
				);
			})}
		</div>
	</div>
);

export const ProductFilterModal: React.FC<IProductFilterModalProps> = ({
	isOpen,
	onClose,
	onApplyFilters,
	onClearFilters,
	initialFilters,
}) => {
	const [localFilters, setLocalFilters] =
		useState<Partial<IFilterOptions>>(initialFilters);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [colors, setColors] = useState<IColor[]>([]);
	const [essences, setEssences] = useState<IEssence[]>([]);
	const [isClosing, setIsClosing] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);

		setTimeout(() => {
			onClose();
			setIsClosing(false);
		}, 200);
	};

	useClickOutside(modalRef, handleClose);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await categoriesGetService.getCategories();
				if (response && response.length > 0) {
					setCategories(response);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};
		const fetchColors = async () => {
			try {
				const response = await colorsGetService.getColors();
				if (response && response.length > 0) {
					setColors(response);
				}
			} catch (error) {
				console.error('Error fetching colors:', error);
			}
		};

		const fetchEssences = async () => {
			try {
				const response = await essencesGetService.getEssences();
				if (response && response.length > 0) {
					setEssences(response);
				}
			} catch (error) {
				console.error('Error fetching essences:', error);
			}
		};
		fetchEssences();
		fetchColors();
		fetchCategories();
	}, []);

	useEffect(() => {
		setLocalFilters(initialFilters);
	}, [initialFilters]);

	if (!isOpen) return null;

	const handlePriceChange = (
		field: 'priceMin' | 'priceMax',
		value: string
	) => {
		const numValue = value === '' ? undefined : Number(value);
		setLocalFilters((prev) => ({ ...prev, [field]: numValue }));
	};

	const handleMultiSelectToggle = (
		field: keyof Pick<
			IFilterOptions,
			'categoryId' | 'essenceId' | 'colorId'
		>,
		value: string
	) => {
		setLocalFilters((prev) => {
			const currentSelection =
				(prev[field] as string[] | undefined) || [];
			const newSelection = currentSelection.includes(value)
				? currentSelection.filter((item) => item !== value)
				: [...currentSelection, value];
			return { ...prev, [field]: newSelection };
		});
	};

	const handleAvailabilityToggle = (value?: boolean) => {
		const newValue = localFilters.hasStock === value ? undefined : value;
		setLocalFilters((prev) => ({ ...prev, hasStock: newValue }));
	};

	const handleApply = () => {
		onApplyFilters(localFilters);
		handleClose();
	};

	const handleClear = () => {
		onClearFilters();
		handleClose();
	};

	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end ${
				isClosing ? 'animate-fade-out' : 'animate-fade-in'
			}`}>
			<div
				ref={modalRef}
				className={`w-full max-w-md bg-white h-full flex flex-col shadow-xl ${
					isClosing
						? 'animate-slide-out-to-right'
						: 'animate-slide-in-from-right'
				}`}>
				<header className='flex items-center justify-between p-4 border-b-2 border-gray_line'>
					<h2 className='text-xl font-bold text-gray-800'>
						Filtrar Productos
					</h2>
					<button
						onClick={handleClose}
						className='p-1 rounded-full hover:bg-gray-200'>
						<X className='h-6 w-6 text-gray-600' />
					</button>
				</header>
				<main className='flex-1 p-6 overflow-y-auto'>
					<div className='mb-6'>
						<h3 className='text-md font-semibold text-gray-700 mb-3'>
							Rango de precios
						</h3>
						<div className='flex items-center gap-4 w-2/4'>
							<Input
								type='number'
								placeholder='0'
								min={0}
								value={localFilters.priceMin ?? ''}
								onChange={(e) =>
									handlePriceChange(
										'priceMin',
										e.target.value
									)
								}
								style={{
									outline: 'none',
									boxShadow: 'none',
									borderColor: '#EB5480',
								}}
								className='border-fucsia rounded-md text-start'
							/>
							<span className='text-gray-500'>-</span>
							<Input
								type='number'
								placeholder='1000'
								min={0}
								value={localFilters.priceMax ?? ''}
								onChange={(e) =>
									handlePriceChange(
										'priceMax',
										e.target.value
									)
								}
								style={{
									outline: 'none',
									boxShadow: 'none',
									borderColor: '#EB5480',
								}}
								className='text-start border-fucsia rounded-md'
							/>
						</div>
					</div>

					<FilterSection
						title='Tipo de producto'
						options={categories}
						selected={localFilters.categoryId || []}
						onToggle={(val) =>
							handleMultiSelectToggle('categoryId', val)
						}
						valueKey='_id'
						labelKey='name'
					/>
					<FilterSection
						title='Aromas'
						options={essences}
						selected={localFilters.essenceId || []}
						onToggle={(val) =>
							handleMultiSelectToggle('essenceId', val)
						}
						valueKey='_id'
						labelKey='name'
					/>
					<FilterSection
						title='Colores'
						options={colors}
						selected={localFilters.colorId || []}
						onToggle={(val) =>
							handleMultiSelectToggle('colorId', val)
						}
						valueKey='_id'
						labelKey='name'
					/>
					<div className='mb-6'>
						<h3 className='text-md font-semibold text-gray-700 mb-3'>
							Disponibilidad
						</h3>
						<div className='flex flex-wrap gap-2'>
							<button
								onClick={() => handleAvailabilityToggle(true)}
								className={`px-4 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
									localFilters.hasStock === true
										? 'bg-pink border-fucsia text-black'
										: 'bg-white border-fucsia text-fucsia hover:bg-pink hover:text-black'
								}`}>
								En stock
							</button>
							<button
								onClick={() => handleAvailabilityToggle(false)}
								className={`px-4 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
									localFilters.hasStock === false
										? 'bg-pink border-fucsia text-black'
										: 'bg-white border-fucsia text-fucsia hover:bg-pink hover:text-black'
								}`}>
								Agotado
							</button>
						</div>
					</div>
				</main>
				<footer className='p-4 border-t-2 border-gray_line space-y-3'>
					<Button
						onClick={handleApply}
						className='w-full bg-pink hover:bg-pink text-gray_text font-bold py-3 rounded-xl'>
						Aplicar filtros
					</Button>
					<Button
						onClick={handleClear}
						variant='outline'
						className='w-full border-fucsia text-fucsia hover:bg-pink font-bold py-3 rounded-xl'>
						Limpiar filtros
					</Button>
				</footer>
			</div>
		</div>
	);
};
