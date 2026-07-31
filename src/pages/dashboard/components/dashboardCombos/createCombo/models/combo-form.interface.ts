import type { ComboPriceMode } from '@/services/combos/models/combos.interface';

/**
 * The fields of a product the combo form actually reads. Narrower than
 * IProductData on purpose: the picker gets its products from the search endpoint
 * while the edit modal gets them from the combo itself, which returns a smaller
 * projection — this is the shape both can satisfy without a cast.
 */
export interface IComboDraftProduct {
	_id: string;
	name: string;
	price: number;
	stock: number;
	isActive: boolean;
}

/**
 * One component being edited. The product is kept whole, not just its id, so the
 * form can preview price and stock without an extra round trip.
 */
export interface IComboItemDraft {
	product: IComboDraftProduct;
	/** Units of this product per single combo. */
	quantity: number;
}

export interface IComboForm {
	/** Required by UploadImage, which uses it to name the Cloudinary folder. */
	name: string;
	description: string;
	images: string[];
	items: IComboItemDraft[];
	priceMode: ComboPriceMode;
	fixedPrice: number;
	discountPercentage: number;
	isActive: boolean;
}

export interface IComboFormErrors {
	name: string;
	description: string;
	items: string;
	price: string;
}
