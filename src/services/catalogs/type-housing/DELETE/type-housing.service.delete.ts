import { AppApiGateWay } from '@/services/app.api.gateway';
import type { ITypeHousing } from '../models/type-housing.interface';

const deleteTypeHousing = async (id: string): Promise<ITypeHousing> => {
	const response = await AppApiGateWay.delete(`/cat-type-housing/${id}`);
	return response.data;
};

export const typeHousingDeleteService = {
	deleteTypeHousing,
};
