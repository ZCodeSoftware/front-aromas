import { AppApiGateWay } from '@/services/app.api.gateway';
import type { IColor } from '../models/colors.interface';

const deleteColor = async (id: string): Promise<IColor> => {
	const response = await AppApiGateWay.delete(`/cat-color/${id}`);
	return response.data;
};

export const colorsDeleteService = {
	deleteColor,
};
