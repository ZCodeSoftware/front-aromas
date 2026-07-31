import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productsGetService } from '@/services/products/GET/products.service.get';
import type { IProductData } from '@/services/products/models/products.interface';
import type { IComboItemDraft } from '../createCombo/models/combo-form.interface';

interface IComboItemsPickerProps {
	value: IComboItemDraft[];
	onChange: (items: IComboItemDraft[]) => void;
	disabled?: boolean;
}

/**
 * Picks products with a quantity each. Deliberately not built on MultiSelect:
 * that component works on plain `string[]` ids and has no room for a quantity,
 * and widening its contract would ripple through the catalogue forms that use it.
 * The search-and-add flow follows the one already proven in RegisterSale.
 */
const ComboItemsPicker: React.FC<IComboItemsPickerProps> = ({
	value,
	onChange,
	disabled = false,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<IProductData[]>([]);
	const [searching, setSearching] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
		null
	);
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		if (
			searchTerm.trim().length < 2 ||
			(selectedProduct && searchTerm === selectedProduct.name)
		) {
			setSearchResults([]);
			return;
		}

		const timeout = setTimeout(async () => {
			setSearching(true);
			try {
				const result = await productsGetService.getProducts({
					search: searchTerm,
					isActive: true,
					limit: 10,
				});
				setSearchResults(result?.data ?? []);
			} catch {
				toast.error('No se pudieron buscar productos.');
			} finally {
				setSearching(false);
			}
		}, 400);

		return () => clearTimeout(timeout);
	}, [searchTerm, selectedProduct]);

	const handleSelectProduct = (product: IProductData) => {
		setSelectedProduct(product);
		setSearchTerm(product.name);
		setIsDropdownOpen(false);
	};

	const handleAddItem = () => {
		if (!selectedProduct) {
			toast.error('Seleccioná un producto para agregar.');
			return;
		}
		if (quantity < 1) {
			toast.error('La cantidad debe ser al menos 1.');
			return;
		}

		// The same product twice is a quantity change, not a second line: the API
		// rejects a duplicated product outright.
		const existing = value.find(
			(item) => item.product._id === selectedProduct._id
		);
		onChange(
			existing
				? value.map((item) =>
						item.product._id === selectedProduct._id
							? { ...item, quantity: item.quantity + quantity }
							: item
					)
				: [...value, { product: selectedProduct, quantity }]
		);

		setSelectedProduct(null);
		setSearchTerm('');
		setSearchResults([]);
		setQuantity(1);
	};

	const handleChangeQuantity = (productId: string, newQuantity: number) => {
		onChange(
			value.map((item) =>
				item.product._id === productId
					? { ...item, quantity: Math.max(1, newQuantity) }
					: item
			)
		);
	};

	const handleRemoveItem = (productId: string) => {
		onChange(value.filter((item) => item.product._id !== productId));
	};

	return (
		<div className='grid gap-3'>
			<div className='grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-start'>
				<div
					data-tutorial='combo-items'
					className='relative grid gap-1.5'>
					<label htmlFor='combo-product-search'>Buscar producto</label>
					<Input
						id='combo-product-search'
						autoComplete='off'
						disabled={disabled}
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setSelectedProduct(null);
							setIsDropdownOpen(true);
						}}
						onFocus={() => setIsDropdownOpen(true)}
						onBlur={() =>
							setTimeout(() => setIsDropdownOpen(false), 150)
						}
						placeholder='Nombre del producto'
					/>
					{isDropdownOpen && searchTerm.trim().length >= 2 && (
						<div className='absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-md'>
							{searching ? (
								<p className='px-3 py-2 text-sm text-aromas_gray_text'>
									Buscando...
								</p>
							) : searchResults.length === 0 ? (
								<p className='px-3 py-2 text-sm text-aromas_gray_text'>
									No se encontraron productos.
								</p>
							) : (
								<ul className='max-h-60 overflow-y-auto'>
									{searchResults.map((product) => (
										<li key={product._id}>
											<button
												type='button'
												onMouseDown={() =>
													handleSelectProduct(product)
												}
												className='w-full px-3 py-2 text-left text-sm hover:bg-aromas_pink/20'>
												{`${product.name} — $${product.price.toFixed(2)} (stock: ${product.stock})`}
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</div>
				<div className='grid gap-1.5'>
					<label htmlFor='combo-item-quantity'>Cantidad</label>
					<Input
						id='combo-item-quantity'
						type='number'
						min={1}
						disabled={disabled}
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value) || 1)}
					/>
				</div>
				<Button
					type='button'
					onClick={handleAddItem}
					disabled={disabled || !selectedProduct}
					className='mt-6 bg-aromas_pink text-aromas_gray_text'>
					<Plus className='mr-2 h-4 w-4' />
					Agregar
				</Button>
			</div>

			<div className='border rounded-lg divide-y'>
				{value.length === 0 ? (
					<p className='text-center text-aromas_gray_text py-6'>
						Todavía no agregaste productos al combo.
					</p>
				) : (
					value.map((item) => {
						// How many combos this single component allows, which is what
						// tells the admin which product is the bottleneck.
						const unitsAvailable = Math.floor(
							item.product.stock / item.quantity
						);

						return (
							<div
								key={item.product._id}
								className='flex items-center justify-between gap-x-4 px-4 py-3'>
								<div className='flex min-w-0 flex-col'>
									<p className='truncate font-medium text-aromas_gray_text'>
										{item.product.name}
									</p>
									<p className='text-sm text-aromas_gray_text'>
										{`$${item.product.price.toFixed(2)} c/u · stock ${item.product.stock} · alcanza para ${unitsAvailable} combo(s)`}
									</p>
								</div>
								<div className='flex shrink-0 items-center gap-x-3'>
									<Input
										type='number'
										min={1}
										aria-label={`Cantidad de ${item.product.name}`}
										disabled={disabled}
										value={item.quantity}
										onChange={(e) =>
											handleChangeQuantity(
												item.product._id,
												Number(e.target.value) || 1
											)
										}
										className='w-20'
									/>
									<p className='w-24 text-right font-semibold text-aromas_fucsia'>
										$
										{(
											item.product.price * item.quantity
										).toFixed(2)}
									</p>
									<button
										type='button'
										disabled={disabled}
										aria-label={`Quitar ${item.product.name}`}
										onClick={() =>
											handleRemoveItem(item.product._id)
										}
										className='text-red-600 hover:text-red-700 disabled:opacity-50'>
										<Trash2 className='h-4 w-4' />
									</button>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default ComboItemsPicker;
