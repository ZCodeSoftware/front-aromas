import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/ui/multi-select';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { categoriesGetService } from '@/services/catalogs/categories/GET/categories.service.get';
import { subCategoriesGetService } from '@/services/catalogs/sub-categories/GET/sub-categories.service.get';
import { productsGetService } from '@/services/products/GET/products.service.get';
import { combosGetService } from '@/services/combos/GET/combos.service.get';
import type { IBaseItem } from '@/models/base-items.interface';
import type { PromotionScope } from '@/services/promotions/models/promotions.interface';
import type { IPromotionForm } from '../createPromotion/models/promotion-form.interface';

interface IPromotionScopeFieldsProps {
	form: IPromotionForm;
	onScopeChange: (scope: PromotionScope) => void;
	onListChange: (
		field: 'categories' | 'subCategories' | 'products' | 'combos',
		selected: string[]
	) => void;
	error?: string;
	disabled?: boolean;
}

const SCOPE_OPTIONS: { value: PromotionScope; label: string }[] = [
	{ value: 'ALL', label: 'Todo el catálogo' },
	{ value: 'CATEGORY', label: 'Categorías' },
	{ value: 'SUBCATEGORY', label: 'Sub-categorías' },
	{ value: 'PRODUCTS', label: 'Productos puntuales' },
	{ value: 'COMBOS', label: 'Combos' },
];

/**
 * The scope selector plus whichever list it needs. Unlike the combo picker this
 * reuses MultiSelect as-is: here a selection is just a set of ids, with no
 * quantity to carry.
 */
const PromotionScopeFields: React.FC<IPromotionScopeFieldsProps> = ({
	form,
	onScopeChange,
	onListChange,
	error,
	disabled = false,
}) => {
	const [categories, setCategories] = useState<IBaseItem[]>([]);
	const [subCategories, setSubCategories] = useState<IBaseItem[]>([]);
	const [products, setProducts] = useState<IBaseItem[]>([]);
	const [combos, setCombos] = useState<IBaseItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadOptions = async () => {
			setLoading(true);
			try {
				// All four at once: the admin switches scope freely and a fetch per
				// switch would make the multi-select come up empty every time.
				const [categoryList, subCategoryList, productList, comboList] =
					await Promise.all([
						categoriesGetService.getCategories(),
						subCategoriesGetService.getSubCategories(),
						productsGetService.getProducts({ limit: 100, isActive: true }),
						combosGetService.getCombos({ limit: 100 }),
					]);

				setCategories(categoryList ?? []);
				setSubCategories(subCategoryList ?? []);
				setProducts(productList?.data ?? []);
				setCombos(comboList?.data ?? []);
			} catch {
				toast.error('No se pudieron cargar las opciones de alcance.');
			} finally {
				setLoading(false);
			}
		};

		loadOptions();
	}, []);

	const lists = {
		CATEGORY: {
			label: 'Categorías alcanzadas',
			options: categories,
			selected: form.categories,
			field: 'categories' as const,
			placeholder: 'Seleccioná categorías...',
		},
		SUBCATEGORY: {
			label: 'Sub-categorías alcanzadas',
			options: subCategories,
			selected: form.subCategories,
			field: 'subCategories' as const,
			placeholder: 'Seleccioná sub-categorías...',
		},
		PRODUCTS: {
			label: 'Productos alcanzados',
			options: products,
			selected: form.products,
			field: 'products' as const,
			placeholder: 'Seleccioná productos...',
		},
		COMBOS: {
			label: 'Combos alcanzados',
			options: combos,
			selected: form.combos,
			field: 'combos' as const,
			placeholder: 'Seleccioná combos...',
		},
	};

	const active = lists[form.scope as keyof typeof lists];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
			<div data-tutorial='promotion-scope' className='grid gap-1.5'>
				<label htmlFor='scope'>Alcance</label>
				<Select
					onValueChange={(value) => onScopeChange(value as PromotionScope)}
					value={form.scope}
					disabled={disabled}>
					<SelectTrigger id='scope'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent className='bg-white'>
						{SCOPE_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{form.scope === 'ALL' && (
					<p className='text-sm text-aromas_gray_text'>
						Se aplica a todos los productos y combos.
					</p>
				)}
			</div>

			{active && (
				<div className='grid gap-1.5'>
					<label>{active.label}</label>
					<MultiSelect
						options={active.options}
						selected={active.selected}
						onChange={(selected) => onListChange(active.field, selected)}
						placeholder={
							loading ? 'Cargando...' : active.placeholder
						}
						className='w-full'
						disabled={disabled || loading}
					/>
					{error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
					{form.scope === 'COMBOS' && (
						<p className='text-sm text-aromas_gray_text'>
							Una promoción por categoría o producto nunca entra dentro
							de un combo, para no descontar dos veces lo mismo.
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default PromotionScopeFields;
