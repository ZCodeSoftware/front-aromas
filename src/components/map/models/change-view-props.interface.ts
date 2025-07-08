import type { LatLng } from 'leaflet';

export interface IChangeViewProps {
	center: LatLng;
	zoom: number;
}
