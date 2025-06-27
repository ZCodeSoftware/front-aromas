import type { IFilterOptions } from './product-filter.interface';

export interface IProductFilterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApplyFilters: (filters: Partial<IFilterOptions>) => void;
	onClearFilters: () => void;
	initialFilters: Partial<IFilterOptions>;
}
