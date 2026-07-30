import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const postAssociatedEmotion = async (associatedEmotion: INamedForm) => {
	try {
		await AppApiGateWay.post('/cat-associated-emotion', associatedEmotion);
	} catch (error) {
		console.error('Error al crear la emoción', error);
	}
};
