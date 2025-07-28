import type { INamedForm } from '@/pages/dashboard/components/dashboardCatalogs/createCatalogs/models/named-form.interface';
import { AppApiGateWayNoJWT } from '@/services/app.api.gateway-no-jwt';

export const putAssociatedEmotion = async (
	id: string,
	associatedEmotion: INamedForm
) => {
	try {
		await AppApiGateWayNoJWT.put(
			`/cat-associated-emotion/${id}`,
			associatedEmotion
		);
	} catch (error) {
		console.error('Error al modificar la emoción', error);
	}
};
