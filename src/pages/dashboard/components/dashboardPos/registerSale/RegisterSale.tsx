import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productsGetService } from '@/services/products/GET/products.service.get';
import { combosGetService } from '@/services/combos/GET/combos.service.get';
import { paymentMethodGetService } from '@/services/catalogs/payment-method/GET/payment-method.service.get';
import { posPostService } from '@/services/pos/POST/pos.service.post';
import { pricingPostService } from '@/services/pricing/POST/pricing.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { IProductData } from '@/services/products/models/products.interface';
import type { IComboData } from '@/services/combos/models/combos.interface';
import type { IPricingResult } from '@/services/pricing/models/pricing.interface';
import type { IPaymentMethod } from '@/services/catalogs/payment-method/models/payment-method.interface';

type SaleItemKind = 'product' | 'combo';

/**
 * A line of the sale. Products and combos are kept apart by `kind`, because their
 * ids come from different collections and the API needs to be told which is which.
 */
interface ISaleLine {
	kind: SaleItemKind;
	_id: string;
	name: string;
	price: number;
	/** Units on hand, so the operator sees what is left before adding more. */
	stock: number;
	quantity: number;
}

/** Either search result, flattened to what a line needs. */
const toLine = (
	kind: SaleItemKind,
	item: IProductData | IComboData,
	quantity: number
): ISaleLine => ({
	kind,
	_id: item._id,
	name: item.name,
	price: item.price,
	stock: item.stock,
	quantity,
});

const RegisterSale: React.FC = () => {
	const [searchKind, setSearchKind] = useState<SaleItemKind>('product');
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<ISaleLine[]>([]);
	const [searching, setSearching] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<ISaleLine | null>(null);
	const [quantity, setQuantity] = useState(1);

	const [lines, setLines] = useState<ISaleLine[]>([]);

	const [couponCode, setCouponCode] = useState('');
	const [pricing, setPricing] = useState<IPricingResult | null>(null);
	const [pricingLoading, setPricingLoading] = useState(false);

	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadPaymentMethods = async () => {
			setLoadingPaymentMethods(true);
			try {
				const methods =
					await paymentMethodGetService.getPaymentMethods();
				setPaymentMethods(methods);
			} catch {
				toast.error('No se pudieron cargar los métodos de pago.');
			} finally {
				setLoadingPaymentMethods(false);
			}
		};
		loadPaymentMethods();
	}, []);

	useEffect(() => {
		if (
			searchTerm.trim().length < 2 ||
			(selectedItem && searchTerm === selectedItem.name)
		) {
			setSearchResults([]);
			return;
		}

		const timeout = setTimeout(async () => {
			setSearching(true);
			try {
				if (searchKind === 'combo') {
					const result = await combosGetService.getCombos({
						search: searchTerm,
						isActive: true,
						limit: 10,
					});
					setSearchResults(
						(result?.data ?? []).map((combo) =>
							toLine('combo', combo, 1)
						)
					);
				} else {
					const result = await productsGetService.getProducts({
						search: searchTerm,
						isActive: true,
						limit: 10,
					});
					setSearchResults(
						(result?.data ?? []).map((product) =>
							toLine('product', product, 1)
						)
					);
				}
			} catch {
				toast.error(
					searchKind === 'combo'
						? 'No se pudieron buscar combos.'
						: 'No se pudieron buscar productos.'
				);
			} finally {
				setSearching(false);
			}
		}, 400);

		return () => clearTimeout(timeout);
	}, [searchTerm, selectedItem, searchKind]);

	/**
	 * The quote comes from the backend so the counter charges exactly what the
	 * storefront would. Re-run whenever the lines or the coupon change; the gross
	 * sum below is only the fallback while it is in flight.
	 */
	useEffect(() => {
		if (!lines.length) {
			setPricing(null);
			return;
		}

		const timeout = setTimeout(async () => {
			setPricingLoading(true);
			try {
				setPricing(
					await pricingPostService.previewPosSale({
						items: lines.map((line) =>
							line.kind === 'combo'
								? { comboId: line._id, quantity: line.quantity }
								: { productId: line._id, quantity: line.quantity }
						),
						couponCode: couponCode.trim() || undefined,
					})
				);
			} catch (error) {
				setPricing(null);
				toast.error(
					getApiErrorMessage(error, 'No se pudo calcular el total.')
				);
			} finally {
				setPricingLoading(false);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [lines, couponCode]);

	/** Gross sum, shown only until the backend answers with the real total. */
	const grossTotal = lines.reduce(
		(sum, line) => sum + line.price * line.quantity,
		0
	);

	const resetForm = () => {
		setLines([]);
		setPaymentMethod('');
		setSearchTerm('');
		setSearchResults([]);
		setSelectedItem(null);
		setQuantity(1);
		setCouponCode('');
		setPricing(null);
	};

	const handleSelectItem = (item: ISaleLine) => {
		setSelectedItem(item);
		setSearchTerm(item.name);
		setIsDropdownOpen(false);
	};

	const handleChangeKind = (kind: SaleItemKind) => {
		setSearchKind(kind);
		setSelectedItem(null);
		setSearchTerm('');
		setSearchResults([]);
	};

	const handleAddLine = () => {
		if (!selectedItem) {
			toast.error('Seleccioná un producto o combo para agregar.');
			return;
		}
		if (quantity < 1) {
			toast.error('La cantidad debe ser al menos 1.');
			return;
		}

		setLines((prev) => {
			// Matched on kind as well as id: a product and a combo may share an id
			// and must never be merged into one line.
			const existing = prev.find(
				(line) =>
					line._id === selectedItem._id && line.kind === selectedItem.kind
			);
			if (existing) {
				return prev.map((line) =>
					line._id === selectedItem._id && line.kind === selectedItem.kind
						? { ...line, quantity: line.quantity + quantity }
						: line
				);
			}
			return [...prev, { ...selectedItem, quantity }];
		});

		setSelectedItem(null);
		setSearchTerm('');
		setSearchResults([]);
		setQuantity(1);
	};

	const handleRemoveLine = (line: ISaleLine) => {
		setLines((prev) =>
			prev.filter(
				(current) =>
					!(current._id === line._id && current.kind === line.kind)
			)
		);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (lines.length === 0) {
			toast.error('Agregá al menos un producto a la venta.');
			return;
		}
		if (!paymentMethod) {
			toast.error('Seleccioná un método de pago.');
			return;
		}
		if (pricing?.couponError) {
			toast.error(pricing.couponError);
			return;
		}

		setSubmitting(true);
		try {
			await posPostService.registerSale({
				items: lines.map((line) =>
					line.kind === 'combo'
						? { comboId: line._id, quantity: line.quantity }
						: { productId: line._id, quantity: line.quantity }
				),
				paymentMethod,
				couponCode: couponCode.trim() || undefined,
			});
			toast.success('Venta registrada con éxito.');
			resetForm();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo registrar la venta.'),
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Card className='w-full max-w-4xl mx-auto my-8'>
			<CardHeader>
				<CardTitle className='text-center text-2xl font-bold'>
					Registrar Venta en Mostrador
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-[150px_1fr_140px_auto] gap-3 items-start'>
						<div data-tutorial='pos-kind' className='grid gap-1.5'>
							<label htmlFor='searchKind'>Vender</label>
							<Select
								value={searchKind}
								onValueChange={(value) =>
									handleChangeKind(value as SaleItemKind)
								}>
								<SelectTrigger id='searchKind'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									<SelectItem value='product'>Producto</SelectItem>
									<SelectItem value='combo'>Combo</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div
							data-tutorial='pos-search'
							className='relative grid gap-1.5'>
							<label htmlFor='search'>
								{searchKind === 'combo'
									? 'Buscar combo'
									: 'Buscar producto'}
							</label>
							<Input
								id='search'
								autoComplete='off'
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setSelectedItem(null);
									setIsDropdownOpen(true);
								}}
								onFocus={() => setIsDropdownOpen(true)}
								onBlur={() =>
									setTimeout(
										() => setIsDropdownOpen(false),
										150,
									)
								}
								placeholder={
									searchKind === 'combo'
										? 'Nombre del combo'
										: 'Nombre del producto'
								}
							/>
							{isDropdownOpen &&
								searchTerm.trim().length >= 2 && (
									<div className='absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-md'>
										{searching ? (
											<p className='px-3 py-2 text-sm text-aromas_gray_text'>
												Buscando...
											</p>
										) : searchResults.length === 0 ? (
											<p className='px-3 py-2 text-sm text-aromas_gray_text'>
												{searchKind === 'combo'
													? 'No se encontraron combos.'
													: 'No se encontraron productos.'}
											</p>
										) : (
											<ul className='max-h-60 overflow-y-auto'>
												{searchResults.map((item) => (
													<li
														key={`${item.kind}:${item._id}`}>
														<button
															type='button'
															onMouseDown={() =>
																handleSelectItem(
																	item,
																)
															}
															className='w-full px-3 py-2 text-left text-sm hover:bg-aromas_pink/20'>
															{`${item.name} — $${item.price.toFixed(2)} (stock: ${item.stock})`}
														</button>
													</li>
												))}
											</ul>
										)}
									</div>
								)}
						</div>
						<div
							data-tutorial='pos-quantity'
							className='grid gap-1.5'>
							<label htmlFor='quantity'>Cantidad</label>
							<Input
								id='quantity'
								type='number'
								min={1}
								value={quantity}
								onChange={(e) =>
									setQuantity(Number(e.target.value) || 1)
								}
							/>
						</div>
						<Button
							type='button'
							onClick={handleAddLine}
							disabled={!selectedItem}
							data-tutorial='pos-add'
							className='mt-6 bg-aromas_pink text-aromas_gray_text'>
							<Plus className='mr-2 h-4 w-4' />
							Agregar
						</Button>
					</div>

					<div
						data-tutorial='pos-lines'
						className='border rounded-lg divide-y'>
						{lines.length === 0 ? (
							<p className='text-center text-aromas_gray_text py-6'>
								Todavía no agregaste productos a la venta.
							</p>
						) : (
							lines.map((line) => (
								<div
									key={`${line.kind}:${line._id}`}
									className='flex items-center justify-between gap-x-4 px-4 py-3'>
									<div className='flex min-w-0 flex-col'>
										<p className='truncate font-medium text-aromas_gray_text'>
											{line.name}
											{line.kind === 'combo' && (
												<span className='ml-2 rounded bg-aromas_fucsia px-1.5 py-0.5 text-xs text-white'>
													COMBO
												</span>
											)}
										</p>
										<p className='text-sm text-aromas_gray_text'>
											{`${line.quantity} x $${line.price.toFixed(2)}`}
										</p>
									</div>
									<div className='flex shrink-0 items-center gap-x-4'>
										<p className='font-semibold text-aromas_fucsia'>
											$
											{(line.price * line.quantity).toFixed(
												2,
											)}
										</p>
										<button
											type='button'
											aria-label={`Quitar ${line.name}`}
											onClick={() => handleRemoveLine(line)}
											className='text-red-600 hover:text-red-700'>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								</div>
							))
						)}
					</div>

					<div data-tutorial='pos-coupon' className='grid gap-1.5'>
						<label htmlFor='couponCode'>Cupón</label>
						<Input
							id='couponCode'
							autoComplete='off'
							value={couponCode}
							onChange={(e) =>
								setCouponCode(e.target.value.toUpperCase())
							}
							placeholder='Código de cupón (opcional)'
							className={
								pricing?.couponError
									? 'border-red-500 focus-visible:ring-red-500'
									: ''
							}
						/>
						{pricing?.couponError && (
							<p className='text-sm text-red-600'>
								{pricing.couponError}
							</p>
						)}
						{pricing?.coupon && (
							<p className='text-sm text-aromas_fucsia'>
								Cupón {pricing.coupon.code} aplicado.
							</p>
						)}
					</div>

					<div className='space-y-1'>
						{pricing && pricing.discountTotal > 0 && (
							<>
								<div className='flex items-center justify-between text-sm text-aromas_gray_text'>
									<span>Subtotal</span>
									<span>
										${pricing.subTotalPrice.toFixed(2)}
									</span>
								</div>
								<div className='flex items-center justify-between text-sm text-aromas_fucsia'>
									<span>Descuento</span>
									<span>
										-${pricing.discountTotal.toFixed(2)}
									</span>
								</div>
							</>
						)}
						<div className='flex items-center justify-between'>
							<h3 className='text-lg font-bold text-aromas_gray_text'>
								Total
							</h3>
							<p className='flex items-center gap-2 text-lg font-bold text-aromas_fucsia'>
								{pricingLoading && (
									<Loader2 className='h-4 w-4 animate-spin' />
								)}
								${(pricing?.totalPrice ?? grossTotal).toFixed(2)}
							</p>
						</div>
					</div>

					<div data-tutorial='pos-payment' className='grid gap-1.5'>
						<label htmlFor='paymentMethod'>Método de pago</label>
						<Select
							value={paymentMethod}
							onValueChange={setPaymentMethod}
							disabled={loadingPaymentMethods}>
							<SelectTrigger
								id='paymentMethod'
								className='w-full'>
								<SelectValue placeholder='Seleccioná un método de pago' />
							</SelectTrigger>
							<SelectContent className='bg-white'>
								{paymentMethods.map((method) => (
									<SelectItem
										key={method._id}
										value={method._id}>
										{method.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='w-full flex justify-center'>
						<Button
							type='submit'
							data-tutorial='pos-submit'
							className='bg-aromas_pink text-aromas_gray_text'
							disabled={submitting || pricingLoading}>
							{submitting && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{submitting ? 'Registrando...' : 'Registrar Venta'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default RegisterSale;
