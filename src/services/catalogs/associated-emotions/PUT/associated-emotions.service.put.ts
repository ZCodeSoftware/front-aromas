import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWay } from '@/services/app.api.gateway';

export const putAssociatedEmotion = async (
	id: string,
	associatedEmotion: INamedForm,
) => {
	try {
		await AppApiGateWay.put(
			`/cat-associated-emotion/${id}`,
			associatedEmotion,
		);
	} catch (error) {
		console.error('Error al modificar la emoción', error);
	}
};
