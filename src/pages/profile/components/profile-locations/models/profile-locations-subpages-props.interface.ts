import type { IProfileLocationsView } from '../types/locations-view';

export interface IProfileLocationsSubpagesProps {
	onNavigate: (view: IProfileLocationsView) => void;
}
