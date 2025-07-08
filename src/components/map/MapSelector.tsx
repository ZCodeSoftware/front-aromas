import { useState } from 'react';
import { Button } from '../ui/button';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import { LatLng } from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import type { ILocationMarkerProps } from './models/location-marker-props.interface';
import type { IChangeViewProps } from './models/change-view-props.interface';
import type { IMapSelectorProps } from './models/map-selector-props.interface';

const LocationMarker = ({
	onPositionChange,
	position,
}: ILocationMarkerProps) => {
	useMapEvents({
		click(e: LeafletMouseEvent) {
			onPositionChange(e.latlng);
		},
	});

	return position === null ? null : (
		<Marker position={position}>
			<Popup>Ubicación seleccionada</Popup>
		</Marker>
	);
};

const ChangeView = ({ center, zoom }: IChangeViewProps) => {
	const map = useMap();
	map.setView(center, zoom);
	return null;
};

const MapSelector = ({
	selectedPosition,
	onPositionChange,
}: IMapSelectorProps) => {
	const initialCenter: [number, number] = [-34.6202, -58.4301];
	const [isLocating, setIsLocating] = useState(false);

	const handleLocateUser = () => {
		if (!navigator.geolocation) {
			alert('La geolocalización no es soportada por tu navegador.');
			return;
		}

		setIsLocating(true);

		const options: PositionOptions = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 0,
		};

		const onSuccess = (position: GeolocationPosition) => {
			const { latitude, longitude } = position.coords;
			const userLocation = new LatLng(latitude, longitude);
			onPositionChange(userLocation);
			setIsLocating(false);
		};

		const onError = (error: GeolocationPositionError) => {
			console.error('Error al obtener la ubicación:', error);
			alert(`No se pudo obtener tu ubicación: ${error.message}`);
			setIsLocating(false);
		};
		navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	};

	return (
		<>
			<div className='h-64 w-full rounded-lg shadow-md flex flex-col'>
				<MapContainer
					center={initialCenter}
					zoom={5}
					scrollWheelZoom={true}
					style={{
						height: '100%',
						width: '100%',
						borderRadius: 'inherit',
					}}>
					<TileLayer
						attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>

					{selectedPosition && (
						<ChangeView center={selectedPosition} zoom={18} />
					)}

					<LocationMarker
						position={selectedPosition}
						onPositionChange={onPositionChange}
					/>
				</MapContainer>
			</div>
			<div className='flex flex-col justify-center items-center mt-2'>
				<Button
					onClick={handleLocateUser}
					className='w-3/4 font-bold py-2 px-2 rounded-lg border border-aromas_fucsia text-aromas_fucsia'>
					{isLocating ? 'Buscando...' : 'Usar mi Ubicación Actual'}
				</Button>
				<span className='w-full text-sm text-center text-gray-400 mt-2'>
					NOTA: La función de ubicación actual puede no ser exacta por
					favor busque su ubicación en los alrededores
				</span>
			</div>
		</>
	);
};

export default MapSelector;
