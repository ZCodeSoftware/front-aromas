export interface ICoordinates {
	lat: number;
	lng: number;
}

const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const getDistanceInMeters = (
	from: ICoordinates,
	to: ICoordinates
): number => {
	const deltaLat = toRadians(to.lat - from.lat);
	const deltaLng = toRadians(to.lng - from.lng);

	const a =
		Math.sin(deltaLat / 2) ** 2 +
		Math.cos(toRadians(from.lat)) *
			Math.cos(toRadians(to.lat)) *
			Math.sin(deltaLng / 2) ** 2;

	return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
