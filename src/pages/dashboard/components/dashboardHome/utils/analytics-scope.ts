import type { IMetricScope } from '@/services/analytics/models/analytics.interface';
import type { ScopeKind } from '../components/ScopeBadge';

/** The API's scope enum, in the badge's terms. */
export const scopeKindOf = (scope: IMetricScope): ScopeKind => {
	switch (scope) {
		case 'SNAPSHOT':
			return 'snapshot';
		case 'LIFETIME':
			return 'lifetime';
		case 'RANGE':
		default:
			return 'range';
	}
};

/**
 * Percentage change against the comparison period, or null when there is no
 * base to compare with — a jump "from zero" is not a percentage, and printing
 * one (or an infinity) would be worse than saying so.
 */
export const percentChange = (
	current: number,
	previous: number
): number | null => {
	if (!Number.isFinite(previous) || previous === 0) return null;
	return ((current - previous) / previous) * 100;
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
	PENDING: 'Pendiente',
	PAID: 'Pagado',
	SHIPPED: 'Enviado',
	DELIVERED: 'Entregado',
	CANCELLED: 'Cancelado',
	REFUNDED: 'Reembolsado',
};

export const CHANNEL_LABELS: Record<string, string> = {
	ONLINE: 'Tienda online',
	POS: 'Punto de venta',
};

export const labelFor = (
	dictionary: Record<string, string>,
	key: string
): string => dictionary[key] ?? key;
