import type { IUserProfile } from '@/services/user/models/user.interface';

export interface IUpdateUserProps {
	data: IUserProfile | null;
	openUpdateModal: boolean;
	setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
	id: string;
	onUpdate: () => Promise<void> | void;
}
