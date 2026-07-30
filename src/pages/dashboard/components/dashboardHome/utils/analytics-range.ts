import { formatDayLong } from './format';

/**
 * The backend cuts calendar days at a fixed UTC offset and does not accept IANA
 * zone names, so the client has to speak the same offset or "today" disagrees
 * between the filter chip and the numbers under it.
 */
export const STORE_TIMEZONE = '-03:00';
const OFFSET_MINUTES = -180;
const MS_PER_DAY = 86_400_000;

/** Longest span the API will resolve. */
export const MAX_RANGE_DAYS = 366;

export type RangePresetId = '7d' | '30d' | '90d' | 'mtd' | '365d' | 'custom';

export interface IAnalyticsRange {
	presetId: RangePresetId;
	dateFrom: string;
	dateTo: string;
	timezone: string;
}

const toStoreDay = (instant: Date): string =>
	new Date(instant.getTime() + OFFSET_MINUTES * 60_000)
		.toISOString()
		.slice(0, 10);

const startOfStoreDay = (day: string): Date =>
	new Date(`${day}T00:00:00.000${STORE_TIMEZONE}`);

const shiftDays = (day: string, days: number): string =>
	toStoreDay(new Date(startOfStoreDay(day).getTime() + days * MS_PER_DAY));

export const todayInStore = (): string => toStoreDay(new Date());

/** Inclusive day count, matching how the API measures the span. */
export const spanInDays = (dateFrom: string, dateTo: string): number =>
	Math.round(
		(startOfStoreDay(dateTo).getTime() - startOfStoreDay(dateFrom).getTime()) /
			MS_PER_DAY
	) + 1;

export const RANGE_PRESETS: { id: RangePresetId; label: string }[] = [
	{ id: '7d', label: 'Últimos 7 días' },
	{ id: '30d', label: 'Últimos 30 días' },
	{ id: '90d', label: 'Últimos 90 días' },
	{ id: 'mtd', label: 'Este mes' },
	{ id: '365d', label: 'Últimos 12 meses' },
	{ id: 'custom', label: 'Personalizado' },
];

/**
 * Resolves a preset to explicit days.
 *
 * Every request carries dates, including the default, so the five views agree:
 * left empty, `/analytics/dashboard` reports all time while the other
 * endpoints default to the last 30 days, and a reader comparing two tabs would
 * be comparing two different periods.
 */
export const resolvePreset = (presetId: RangePresetId): IAnalyticsRange => {
	const dateTo = todayInStore();

	const dateFrom = (() => {
		switch (presetId) {
			case '7d':
				return shiftDays(dateTo, -6);
			case '90d':
				return shiftDays(dateTo, -89);
			case '365d':
				return shiftDays(dateTo, -364);
			case 'mtd':
				return `${dateTo.slice(0, 7)}-01`;
			case '30d':
			case 'custom':
			default:
				return shiftDays(dateTo, -29);
		}
	})();

	return { presetId, dateFrom, dateTo, timezone: STORE_TIMEZONE };
};

export const DEFAULT_RANGE = resolvePreset('30d');

export interface IRangeValidation {
	isValid: boolean;
	message?: string;
}

export const validateRange = (
	dateFrom: string,
	dateTo: string
): IRangeValidation => {
	if (!dateFrom || !dateTo) {
		return { isValid: false, message: 'Elegí una fecha de inicio y una de fin.' };
	}

	if (Number.isNaN(startOfStoreDay(dateFrom).getTime())) {
		return { isValid: false, message: 'La fecha de inicio no es válida.' };
	}

	if (Number.isNaN(startOfStoreDay(dateTo).getTime())) {
		return { isValid: false, message: 'La fecha de fin no es válida.' };
	}

	if (startOfStoreDay(dateFrom).getTime() > startOfStoreDay(dateTo).getTime()) {
		return {
			isValid: false,
			message: 'La fecha de inicio debe ser anterior o igual a la de fin.',
		};
	}

	if (spanInDays(dateFrom, dateTo) > MAX_RANGE_DAYS) {
		return {
			isValid: false,
			message: `El período no puede superar los ${MAX_RANGE_DAYS} días.`,
		};
	}

	return { isValid: true };
};

/**
 * The equally long period immediately before this one, so a KPI can say
 * whether it went up or down instead of only stating a number. Ending the day
 * before `dateFrom` keeps the two windows disjoint.
 */
export const previousPeriod = (range: IAnalyticsRange): IAnalyticsRange => {
	const span = spanInDays(range.dateFrom, range.dateTo);
	const dateTo = shiftDays(range.dateFrom, -1);

	return {
		presetId: range.presetId,
		dateFrom: shiftDays(dateTo, -(span - 1)),
		dateTo,
		timezone: range.timezone,
	};
};

/** Reader-facing description of the active period. */
export const describeRange = (range: IAnalyticsRange): string =>
	`${formatDayLong(range.dateFrom)} a ${formatDayLong(range.dateTo)}`;

/**
 * A day bucket per point gets unreadable past a couple of months, so the
 * granularity of the sales chart follows the length of the period.
 */
export const suggestedGroupBy = (
	range: IAnalyticsRange
): 'day' | 'week' | 'month' => {
	const span = spanInDays(range.dateFrom, range.dateTo);
	if (span <= 45) return 'day';
	if (span <= 180) return 'week';
	return 'month';
};
