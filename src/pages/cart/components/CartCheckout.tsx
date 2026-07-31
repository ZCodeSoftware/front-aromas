import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { paymentMethodGetService } from '@/services/catalogs/payment-method/GET/payment-method.service.get';
import { userGetService } from '@/services/user/GET/user.service.get';
import { orderPostService } from '@/services/order/POST/order.service.post';
import { pricingPostService } from '@/services/pricing/POST/pricing.service.post';
import { getApiErrorMessage } from '@/services/auth/utils/get-api-error-message';
import { useCartStore } from '@/stores/cart.store';
import { getDistanceInMeters } from '@/lib/geo';
import {
	MAX_DELIVERY_BLOCKS,
	MAX_DELIVERY_DISTANCE_METERS,
	STORE_REFERENCE_COORDINATES,
} from '../constants/deliveryZoneConstants';
import type { IPaymentMethod } from '@/services/catalogs/payment-method/models/payment-method.interface';
import type { IAddress } from '@/services/address/models/address.interface';
import type { IShippingType } from '@/services/order/models/order.interface';
import type { IPricingResult } from '@/services/pricing/models/pricing.interface';

const isAddressWithinDeliveryRange = (address: IAddress): boolean => {
	if (!address.geo) return false;
	const lat = Number(address.geo.lat);
	const lng = Number(address.geo.lng);
	if (Number.isNaN(lat) || Number.isNaN(lng)) return false;

	return (
		getDistanceInMeters(STORE_REFERENCE_COORDINATES, { lat, lng }) <=
		MAX_DELIVERY_DISTANCE_METERS
	);
};

interface CartCheckoutProps {
	onSuccess: () => void;
}

const CartCheckout: React.FC<CartCheckoutProps> = ({ onSuccess }) => {
	const resetLocalCart = useCartStore((state) => state.resetLocalCart);

	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [addresses, setAddresses] = useState<IAddress[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const [paymentMethod, setPaymentMethod] = useState('');
	const [shippingType, setShippingType] = useState<IShippingType>('PICKUP');
	const [addressId, setAddressId] = useState('');

	const [couponInput, setCouponInput] = useState('');
	/** The code actually sent to the server; only changes when "Aplicar" is used. */
	const [appliedCoupon, setAppliedCoupon] = useState('');
	const [pricing, setPricing] = useState<IPricingResult | null>(null);
	const [pricingLoading, setPricingLoading] = useState(false);

	const deliverableAddresses = addresses.filter(isAddressWithinDeliveryRange);
	const hasDeliverableAddress = deliverableAddresses.length > 0;

	useEffect(() => {
		const loadCheckoutData = async () => {
			setLoading(true);
			try {
				const [methods, profile] = await Promise.all([
					paymentMethodGetService.getPaymentMethods(),
					userGetService.getMyProfile(),
				]);
				setPaymentMethods(methods);
				setAddresses(profile.address ?? []);
			} catch {
				toast.error('No se pudieron cargar los datos para el pago.');
			} finally {
				setLoading(false);
			}
		};
		loadCheckoutData();
	}, []);

	/**
	 * The only authoritative total. Re-run when the coupon is applied or the
	 * delivery type changes, since shipping is part of what the buyer agrees to
	 * even though it is never discounted.
	 *
	 * There is no shipping-rate engine yet, so nothing is sent and the server
	 * treats it as 0 — the same figure the order will be created with.
	 */
	useEffect(() => {
		const loadPricing = async () => {
			setPricingLoading(true);
			try {
				setPricing(
					await pricingPostService.previewOrder({
						couponCode: appliedCoupon || undefined,
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
		};

		loadPricing();
	}, [appliedCoupon, shippingType]);

	const handleSubmit = async () => {
		if (!paymentMethod) {
			toast.error('Seleccioná un método de pago.');
			return;
		}
		if (
			shippingType === 'DELIVERY' &&
			!deliverableAddresses.some((address) => address._id === addressId)
		) {
			toast.error(
				'Seleccioná una dirección de envío dentro de la zona de cobertura.',
			);
			return;
		}

		// The server would reject it too, but failing here saves a round trip and
		// keeps the reason on screen next to the field.
		if (pricing?.couponError) {
			toast.error(pricing.couponError);
			return;
		}

		setSubmitting(true);
		try {
			await orderPostService.createOrder({
				paymentMethod,
				shippingType,
				addressId: shippingType === 'DELIVERY' ? addressId : undefined,
				couponCode: appliedCoupon || undefined,
			});
			resetLocalCart();
			toast.success('¡Tu pedido fue creado con éxito!');
			onSuccess();
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, 'No se pudo completar la compra.'),
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<main className='flex-1 p-6'>
				<p className='text-center text-aromas_gray_text py-6'>
					Cargando datos de pago...
				</p>
			</main>
		);
	}

	return (
		<main className='flex-1 overflow-y-auto p-4 flex flex-col gap-y-6'>
			<div>
				<label
					htmlFor='couponCode'
					className='text-sm text-aromas_gray_text'>
					Cupón de descuento
				</label>
				<div className='flex gap-x-2'>
					<Input
						id='couponCode'
						autoComplete='off'
						value={couponInput}
						onChange={(e) =>
							setCouponInput(e.target.value.toUpperCase())
						}
						placeholder='Ingresá tu código'
						className={
							pricing?.couponError
								? 'border-red-500 focus-visible:ring-red-500'
								: ''
						}
					/>
					<Button
						type='button'
						variant='outline'
						disabled={pricingLoading}
						onClick={() => setAppliedCoupon(couponInput.trim())}>
						{appliedCoupon && couponInput.trim() === appliedCoupon
							? 'Aplicado'
							: 'Aplicar'}
					</Button>
				</div>
				{pricing?.couponError && (
					<p className='text-xs text-red-600 pt-1'>
						{pricing.couponError}
					</p>
				)}
				{pricing?.coupon && (
					<p className='text-xs text-aromas_fucsia pt-1'>
						Cupón {pricing.coupon.code} aplicado.
					</p>
				)}
			</div>

			<div className='flex flex-col gap-y-1 rounded-lg bg-aromas_home_bg p-3'>
				<div className='flex items-center justify-between text-sm text-aromas_gray_text'>
					<span>Subtotal</span>
					<span>${(pricing?.subTotalPrice ?? 0).toFixed(2)}</span>
				</div>
				{!!pricing?.discountTotal && (
					<div className='flex items-center justify-between text-sm text-aromas_fucsia'>
						<span>Descuento</span>
						<span>-${pricing.discountTotal.toFixed(2)}</span>
					</div>
				)}
				{!!pricing?.shippingPrice && (
					<div className='flex items-center justify-between text-sm text-aromas_gray_text'>
						<span>Envío</span>
						<span>${pricing.shippingPrice.toFixed(2)}</span>
					</div>
				)}
				<div className='flex items-center justify-between border-t border-aromas_gray_line pt-1'>
					<h3 className='font-bold text-aromas_gray_text'>Total</h3>
					<p className='flex items-center gap-2 font-bold text-aromas_fucsia'>
						{pricingLoading && (
							<Loader2 className='h-4 w-4 animate-spin' />
						)}
						${(pricing?.totalPrice ?? 0).toFixed(2)}
					</p>
				</div>
			</div>

			<div>
				<label className='text-sm text-aromas_gray_text'>
					Método de pago
				</label>
				<Select value={paymentMethod} onValueChange={setPaymentMethod}>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Seleccioná un método de pago' />
					</SelectTrigger>
					<SelectContent className='bg-white'>
						{paymentMethods.map((method) => (
							<SelectItem
								className='cursor-pointer hover:bg-aromas_pink'
								key={method._id}
								value={method._id}>
								{method.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<label className='text-sm text-aromas_gray_text'>
					Tipo de entrega
				</label>
				<Select
					value={shippingType}
					onValueChange={(value) =>
						setShippingType(value as IShippingType)
					}>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Seleccioná un tipo de entrega' />
					</SelectTrigger>
					<SelectContent className='bg-white'>
						<SelectItem
							className='cursor-pointer hover:bg-aromas_pink'
							value='PICKUP'>
							Retiro en el local
						</SelectItem>
						<SelectItem
							className='cursor-pointer hover:bg-aromas_pink'
							value='DELIVERY'
							disabled={!hasDeliverableAddress}>
							Envío a domicilio
						</SelectItem>
					</SelectContent>
				</Select>
				{!hasDeliverableAddress && (
					<p className='text-xs text-aromas_gray_text pt-1'>
						{addresses.length === 0
							? 'No tenés direcciones guardadas. Agregá una desde tu perfil para poder recibir envíos.'
							: `Ninguna de tus direcciones está a ${MAX_DELIVERY_BLOCKS} cuadras o menos del local, así que el envío a domicilio no está disponible.`}
					</p>
				)}
			</div>

			{shippingType === 'DELIVERY' && (
				<div>
					<label className='text-sm text-aromas_gray_text'>
						Dirección de envío
					</label>
					<Select value={addressId} onValueChange={setAddressId}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Seleccioná una dirección' />
						</SelectTrigger>
						<SelectContent className='bg-white'>
							{deliverableAddresses.map((address) => (
								<SelectItem
									className='cursor-pointer hover:bg-aromas_pink'
									key={address._id}
									value={address._id}>
									{address.name ||
										`${address.street} ${address.number ?? ''}`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}

			<Button
				onClick={handleSubmit}
				disabled={submitting || pricingLoading}
				className='w-full mt-auto bg-aromas_pink text-aromas_gray_text font-bold py-3 px-4 rounded-full disabled:opacity-50 border border-transparent hover:border-aromas_fucsia transition-colors'>
				{submitting ? 'Confirmando...' : 'Confirmar pedido'}
			</Button>
		</main>
	);
};

export default CartCheckout;
