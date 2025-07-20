import type { IBaseItem } from '@/models/base-items.interface';

export interface IUpdateProps<TData extends IBaseItem> {
	data: TData | null;
	openUpdateModal: boolean;
	setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
	id: string;
	onUpdate: () => Promise<void> | void;
}
