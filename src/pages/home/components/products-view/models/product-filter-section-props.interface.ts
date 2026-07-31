import type { IBaseItem } from '@/models/base-items.interface';

export interface IFilterSectionProps {
	title: string;
	/**
	 * Plain strings, or catalogue rows filtered by `_id` and labelled by `name`.
	 * Typed concretely rather than through dynamic keys: every call site read the
	 * same two fields, so the keys were configuration nobody ever varied.
	 */
	options: string[] | IBaseItem[];
	selected: string[];
	onToggle: (value: string) => void;
}
