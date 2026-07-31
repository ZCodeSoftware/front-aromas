import type { IComboForm } from '../createCombo/models/combo-form.interface';
import {
	getComboPrice,
	getCompareAtPrice,
	getDerivedStock,
} from '../utils/comboFormValidation';

interface IComboPriceSummaryProps {
	form: IComboForm;
}

/**
 * Live preview of what the combo will cost and how many of it can be assembled.
 * The API recomputes both on every read from the live catalogue — this only
 * exists so the admin is not typing a price blind.
 */
const ComboPriceSummary: React.FC<IComboPriceSummaryProps> = ({ form }) => {
	const compareAtPrice = getCompareAtPrice(form.items);
	const price = getComboPrice(form);
	const savings = Math.max(0, compareAtPrice - price);
	const savingsPercentage =
		compareAtPrice > 0 ? (savings / compareAtPrice) * 100 : 0;
	const stock = getDerivedStock(form.items);
	const hasInactiveComponent = form.items.some((item) => !item.product.isActive);

	return (
		<div className='rounded-lg border bg-aromas_pink/10 p-4'>
			<h3 className='mb-3 font-semibold text-aromas_gray_text'>
				Resumen del combo
			</h3>
			<dl className='grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-4'>
				<div>
					<dt className='text-aromas_gray_text'>Suma de productos</dt>
					<dd className='font-medium'>${compareAtPrice.toFixed(2)}</dd>
				</div>
				<div>
					<dt className='text-aromas_gray_text'>Precio del combo</dt>
					<dd className='text-base font-bold text-aromas_fucsia'>
						${price.toFixed(2)}
					</dd>
				</div>
				<div>
					<dt className='text-aromas_gray_text'>Ahorro</dt>
					<dd className='font-medium'>
						{savings > 0
							? `$${savings.toFixed(2)} (${savingsPercentage.toFixed(0)}%)`
							: '—'}
					</dd>
				</div>
				<div>
					<dt className='text-aromas_gray_text'>Stock disponible</dt>
					<dd className='font-medium'>{stock} combo(s)</dd>
				</div>
			</dl>

			{form.items.length > 0 && stock === 0 && (
				<p className='mt-3 text-sm text-red-600'>
					{hasInactiveComponent
						? 'Hay un producto desactivado en el combo: no se va a poder vender hasta reactivarlo.'
						: 'No hay stock suficiente en alguno de los productos, el combo no se va a poder vender.'}
				</p>
			)}
			{savings === 0 && compareAtPrice > 0 && price > compareAtPrice && (
				<p className='mt-3 text-sm text-red-600'>
					El precio del combo es mayor que comprar los productos por
					separado.
				</p>
			)}
		</div>
	);
};

export default ComboPriceSummary;
