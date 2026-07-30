import { AppApiGateWay } from '@/services/app.api.gateway';

/** Backend path of every catalog the dashboard manages. */
export type CatalogResource =
	| 'cat-associated-emotion'
	| 'cat-brand'
	| 'cat-category'
	| 'cat-color'
	| 'cat-essence'
	| 'cat-payment-method'
	| 'cat-role'
	| 'cat-sub-category'
	| 'cat-type-housing';

/**
 * Admin listing: the same rows as the public GET plus the deactivated ones, so the
 * dashboard can switch them back on. Requires an admin token.
 */
export const getCatalogIncludingInactive = async <T>(
	resource: CatalogResource
): Promise<T[]> => {
	const response = await AppApiGateWay.get(`/${resource}/all`);
	return response.data;
};

/** Deactivates (false) or restores (true) a catalog row. */
export const setCatalogItemActive = async (
	resource: CatalogResource,
	id: string,
	isActive: boolean
) => {
	await AppApiGateWay.put(`/${resource}/${id}`, { isActive });
};
