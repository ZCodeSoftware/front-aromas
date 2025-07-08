import type { LatLng } from 'leaflet';

export interface ILocationMarkerProps {
	onPositionChange: (latlng: LatLng) => void;
	position: LatLng | null;
}
