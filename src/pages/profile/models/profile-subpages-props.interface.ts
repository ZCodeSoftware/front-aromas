import type { IProfileView } from '../types/profile-view';

export interface IProfileSubpagesProps {
	onNavigate: (view: IProfileView, addressId?: string) => void;
	setIsClosing?: (isClosing: boolean) => void;
	onClose?: () => void;
}
