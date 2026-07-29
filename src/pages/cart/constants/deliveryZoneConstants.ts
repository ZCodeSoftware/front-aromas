import type { ICoordinates } from '@/lib/geo';

export const STORE_REFERENCE_COORDINATES: ICoordinates = {
	lat: -34.57965597153352,
	lng: -58.48351554522083,
};

export const METERS_PER_BLOCK = 100;
export const MAX_DELIVERY_BLOCKS = 15;
export const MAX_DELIVERY_DISTANCE_METERS =
	MAX_DELIVERY_BLOCKS * METERS_PER_BLOCK;
