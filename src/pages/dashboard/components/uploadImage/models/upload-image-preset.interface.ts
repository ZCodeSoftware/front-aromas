export interface IPreset<T> {
	setUrl: React.Dispatch<React.SetStateAction<Blob[]>>;
	form: T;
	handleMouseEnter?: () => void;
	handleMouseLeave?: () => void;
	imageFiles: Blob[];
	isMultiple?: boolean;
	customStyle?: string;
}
