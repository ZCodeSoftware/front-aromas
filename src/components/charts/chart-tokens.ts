/**
 * Chart roles, resolved to the CSS custom properties declared on `.viz-root`
 * in index.css. Charts never hard-code hex: reading through `var()` keeps the
 * light and dark steps in one place and keeps every chart on the validated
 * categorical order.
 */

/** Fixed categorical order. Assign by slot, never by rank, never cycled. */
export const SERIES = [
	'var(--viz-series-1)',
	'var(--viz-series-2)',
	'var(--viz-series-3)',
	'var(--viz-series-4)',
	'var(--viz-series-5)',
	'var(--viz-series-6)',
	'var(--viz-series-7)',
	'var(--viz-series-8)',
] as const;

/**
 * Slot for the nth series. Past the eighth slot the caller must fold the tail
 * into "Otros" instead of asking for a ninth hue — a generated hue is
 * indistinguishable from an existing slot under colour-vision deficiency.
 */
export const seriesColor = (index: number): string =>
	SERIES[Math.min(index, SERIES.length - 1)];

export const CHART = {
	surface: 'var(--viz-surface)',
	ink: 'var(--viz-ink)',
	inkSecondary: 'var(--viz-ink-secondary)',
	inkAxis: 'var(--viz-ink-axis)',
	grid: 'var(--viz-grid)',
	baseline: 'var(--viz-baseline)',
	deemphasis: 'var(--viz-deemphasis)',
} as const;

/** Reserved: only ever used when the colour *means* a state. */
export const STATUS = {
	good: 'var(--viz-status-good)',
	warning: 'var(--viz-status-warning)',
	serious: 'var(--viz-status-serious)',
	critical: 'var(--viz-status-critical)',
} as const;

export type StatusRole = keyof typeof STATUS;

export interface IOrdinalStep {
	fill: string;
	/** Ink that clears 4.5:1 on `fill` — for a value printed inside the mark. */
	onFill: string;
}

/**
 * The ordered scale: one hue, five steps, low magnitude first.
 *
 * Used for both ordinal marks (funnel stages) and binned magnitude (heat
 * cells) — five validated steps beat a continuous interpolation that can land
 * on a step no ink reads against. The dark values are their own selection, not
 * a flip: on a dark surface the ramp reverses so magnitude still reads.
 */
export const ORDINAL_STEPS: readonly IOrdinalStep[] = [
	{ fill: 'var(--viz-ord-1)', onFill: 'var(--viz-on-ord-1)' },
	{ fill: 'var(--viz-ord-2)', onFill: 'var(--viz-on-ord-2)' },
	{ fill: 'var(--viz-ord-3)', onFill: 'var(--viz-on-ord-3)' },
	{ fill: 'var(--viz-ord-4)', onFill: 'var(--viz-on-ord-4)' },
	{ fill: 'var(--viz-ord-5)', onFill: 'var(--viz-on-ord-5)' },
];

/** Step for position `index` of `total` ordered marks. */
export const ordinalStep = (index: number, total: number): IOrdinalStep => {
	if (total <= 1) return ORDINAL_STEPS[ORDINAL_STEPS.length - 1];
	const position = Math.round(
		(index / (total - 1)) * (ORDINAL_STEPS.length - 1)
	);
	return ORDINAL_STEPS[Math.min(position, ORDINAL_STEPS.length - 1)];
};

/** Step for a 0..1 magnitude, for binned heat cells. */
export const magnitudeStep = (intensity: number): IOrdinalStep => {
	const clamped = Math.min(1, Math.max(0, intensity));
	return ORDINAL_STEPS[
		Math.round(clamped * (ORDINAL_STEPS.length - 1))
	];
};

/** Mark specs, fixed across every chart in this kit. */
export const MARK = {
	/** Never fill the band; the leftover is air. */
	maxBarThickness: 24,
	/** Rounded data-end, square at the baseline. */
	barRadius: 4,
	lineWidth: 2,
	markerRadius: 4,
	/** White doing the separating, instead of a stroke around each mark. */
	surfaceGap: 2,
	areaOpacity: 0.1,
	/** WCAG 2.5.8: no hit target below this. */
	minHitTarget: 24,
} as const;

export const AXIS_FONT_SIZE = 11;
export const LABEL_FONT_SIZE = 11;

/**
 * Cycles the four hatches from ChartTexture so touching marks never share one.
 * The class only resolves to a pattern inside `forced-colors` / `print`.
 */
export const textureClass = (index: number): string =>
	`viz-fill-${(index % 4) + 1}`;
