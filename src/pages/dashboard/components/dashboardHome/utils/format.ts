import type { IGroupBy } from '@/services/analytics/models/analytics.interface';

const LOCALE = 'es-AR';

/** Full precision. Used in tables, tooltips and anywhere money is read exactly. */
export const formatCurrency = (value: number): string =>
	new Intl.NumberFormat(LOCALE, {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);

/**
 * Short form for axis ticks and tile values, where four decimal-aligned digits
 * would crowd the plot. The exact figure is always one table away.
 */
export const formatCurrencyCompact = (value: number): string =>
	new Intl.NumberFormat(LOCALE, {
		style: 'currency',
		currency: 'ARS',
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

export const formatInteger = (value: number): string =>
	new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(value);

export const formatCompactNumber = (value: number): string =>
	new Intl.NumberFormat(LOCALE, {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(value);

export const formatPercent = (value: number): string =>
	`${value.toFixed(1)}%`;

export const formatUnits = (value: number): string =>
	`${formatInteger(value)} u.`;

const MONTHS_SHORT = [
	'ene',
	'feb',
	'mar',
	'abr',
	'may',
	'jun',
	'jul',
	'ago',
	'sep',
	'oct',
	'nov',
	'dic',
];

/**
 * Bucket keys arrive as calendar strings, not instants: days and weeks as
 * `YYYY-MM-DD`, months as `YYYY-MM`. They are split rather than parsed with
 * `new Date()`, because parsing a bare date string and reading it back in the
 * browser's zone shifts it a day for anyone west of UTC.
 */
export const formatBucketLabel = (
	bucket: string,
	groupBy: IGroupBy
): string => {
	const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(bucket);

	if (dayMatch) {
		const [, , month, day] = dayMatch;
		return groupBy === 'week' ? `sem. ${day}/${month}` : `${day}/${month}`;
	}

	const monthMatch = /^(\d{4})-(\d{2})$/.exec(bucket);

	if (monthMatch) {
		const [, year, month] = monthMatch;
		return `${MONTHS_SHORT[Number(month) - 1]} ${year.slice(2)}`;
	}

	return bucket;
};

/** Long form for the range summary: "29 jul 2026". */
export const formatDayLong = (day: string): string => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
	if (!match) return day;
	const [, year, month, dayOfMonth] = match;
	return `${Number(dayOfMonth)} ${MONTHS_SHORT[Number(month) - 1]} ${year}`;
};

/** An ISO instant rendered as a calendar day, for "last order at" columns. */
export const formatInstantAsDay = (instant: string): string => {
	const parsed = new Date(instant);
	if (Number.isNaN(parsed.getTime())) return '—';
	return parsed.toLocaleDateString(LOCALE, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
};
