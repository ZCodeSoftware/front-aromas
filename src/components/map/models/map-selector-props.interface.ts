import type { LatLng } from 'leaflet';

export interface IMapSelectorProps {
	selectedPosition: LatLng | null;
	onPositionChange: (latlng: LatLng) => void;
}
