import type { IProfileView } from '@/pages/profile/types/profile-view';

export interface IProfileLocationsSubpagesProps {
	onNavigate: (view: IProfileView) => void;
}
