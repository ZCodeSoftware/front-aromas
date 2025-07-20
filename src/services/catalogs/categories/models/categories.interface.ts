import type { IBaseItem } from '@/models/base-items.interface';
import type { ISubCategory } from '../../sub-categories/models/sub-categories.interface';

export interface ICategory extends IBaseItem {
	subCategories: ISubCategory[];
}
