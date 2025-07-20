import type { IProductData } from '@/services/products/models/products.interface';

export interface IUpdateProduct {
	productData: IProductData | null;
	openUpdateModal: boolean;
	setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
	productId: string;
	onUpdate: () => Promise<void>;
}
