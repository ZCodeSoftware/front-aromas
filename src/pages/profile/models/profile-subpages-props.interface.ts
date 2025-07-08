import type { IProfileView } from '../types/profile-view';

export interface IProfileSubpagesProps {
	onNavigate: (view: IProfileView) => void;
}
