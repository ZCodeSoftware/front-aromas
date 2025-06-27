interface IFilterOptionObject {
	[key: string]: any;
}

export interface IFilterSectionProps {
	title: string;
	options: string[] | IFilterOptionObject[];
	selected: string[];
	onToggle: (value: string) => void;
	valueKey?: string;
	labelKey?: string;
}
