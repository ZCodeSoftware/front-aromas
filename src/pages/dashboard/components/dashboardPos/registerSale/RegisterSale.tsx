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
import { paymentMethodGetService } from '@/services/catalogs/payment-method/GET/payment-method.service.get';
import { posPostService } from '@/services/pos/POST/pos.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import type { IProductData } from '@/services/products/models/products.interface';
import type { IPaymentMethod } from '@/services/catalogs/payment-method/models/payment-method.interface';

interface ISaleLine {
	product: IProductData;
	quantity: number;
}

const RegisterSale: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<IProductData[]>([]);
	const [searching, setSearching] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
		null
	);
	const [quantity, setQuantity] = useState(1);

	const [lines, setLines] = useState<ISaleLine[]>([]);

	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const loadPaymentMethods = async () => {
			setLoadingPaymentMethods(true);
			try {
				const methods = await paymentMethodGetService.getPaymentMethods();
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

	const total = lines.reduce(
		(sum, line) => sum + line.product.price * line.quantity,
		0
	);

	const resetForm = () => {
		setLines([]);
		setPaymentMethod('');
		setSearchTerm('');
		setSearchResults([]);
		setSelectedProduct(null);
		setQuantity(1);
	};

	const handleSelectProduct = (product: IProductData) => {
		setSelectedProduct(product);
		setSearchTerm(product.name);
		setIsDropdownOpen(false);
	};

	const handleAddLine = () => {
		if (!selectedProduct) {
			toast.error('Seleccioná un producto para agregar.');
			return;
		}
		if (quantity < 1) {
			toast.error('La cantidad debe ser al menos 1.');
			return;
		}

		setLines((prev) => {
			const existing = prev.find(
				(line) => line.product._id === selectedProduct._id
			);
			if (existing) {
				return prev.map((line) =>
					line.product._id === selectedProduct._id
						? { ...line, quantity: line.quantity + quantity }
						: line
				);
			}
			return [...prev, { product: selectedProduct, quantity }];
		});

		setSelectedProduct(null);
		setSearchTerm('');
		setSearchResults([]);
		setQuantity(1);
	};

	const handleRemoveLine = (productId: string) => {
		setLines((prev) =>
			prev.filter((line) => line.product._id !== productId)
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

		setSubmitting(true);
		try {
			await posPostService.registerSale({
				items: lines.map((line) => ({
					productId: line.product._id,
					quantity: line.quantity,
				})),
				paymentMethod,
			});
			toast.success('Venta registrada con éxito.');
			resetForm();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo registrar la venta.')
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
					<div className='grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-3 items-start'>
						<div
							data-tutorial='pos-search'
							className='relative grid gap-1.5'>
							<label htmlFor='search'>Buscar producto</label>
							<Input
								id='search'
								autoComplete='off'
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setSelectedProduct(null);
									setIsDropdownOpen(true);
								}}
								onFocus={() => setIsDropdownOpen(true)}
								onBlur={() =>
									setTimeout(
										() => setIsDropdownOpen(false),
										150
									)
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
															handleSelectProduct(
																product
															)
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
						<div data-tutorial='pos-quantity' className='grid gap-1.5'>
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
							disabled={!selectedProduct}
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
									key={line.product._id}
									className='flex items-center justify-between gap-x-4 px-4 py-3'>
									<div className='flex flex-col'>
										<p className='font-medium text-aromas_gray_text'>
											{line.product.name}
										</p>
										<p className='text-sm text-aromas_gray_text'>
											{`${line.quantity} x $${line.product.price.toFixed(2)}`}
										</p>
									</div>
									<div className='flex items-center gap-x-4'>
										<p className='font-semibold text-aromas_fucsia'>
											${(line.product.price * line.quantity).toFixed(2)}
										</p>
										<button
											type='button'
											onClick={() =>
												handleRemoveLine(line.product._id)
											}
											className='text-red-600 hover:text-red-700'>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								</div>
							))
						)}
					</div>

					<div className='flex items-center justify-between'>
						<h3 className='text-lg font-bold text-aromas_gray_text'>
							Total
						</h3>
						<p className='text-lg font-bold text-aromas_fucsia'>
							${total.toFixed(2)}
						</p>
					</div>

					<div data-tutorial='pos-payment' className='grid gap-1.5'>
						<label htmlFor='paymentMethod'>Método de pago</label>
						<Select
							value={paymentMethod}
							onValueChange={setPaymentMethod}
							disabled={loadingPaymentMethods}>
							<SelectTrigger id='paymentMethod' className='w-full'>
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
							className='w-3/12 bg-aromas_pink text-aromas_gray_text'
							disabled={submitting}>
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
