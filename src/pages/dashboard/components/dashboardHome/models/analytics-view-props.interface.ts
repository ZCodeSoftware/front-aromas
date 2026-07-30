import type { IAnalyticsRange } from '../utils/analytics-range';

/** Every metrics view is scoped by the one filter row above the tab strip. */
export interface IAnalyticsViewProps {
	range: IAnalyticsRange;
}
