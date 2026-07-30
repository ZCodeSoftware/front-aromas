/** Axis maths shared by every chart in the kit. */

/** Rounds an axis top up to a readable number, so ticks land on clean values. */
export const niceMax = (value: number): number => {
	if (!Number.isFinite(value) || value <= 0) return 1;

	const magnitude = 10 ** Math.floor(Math.log10(value));

	for (const step of [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]) {
		const candidate = step * magnitude;
		if (candidate >= value) return candidate;
	}

	return 10 * magnitude;
};

/** Evenly spaced tick values from 0 to `max`, inclusive at both ends. */
export const ticksTo = (max: number, count = 4): number[] =>
	Array.from({ length: count + 1 }, (_, index) => (max / count) * index);

/**
 * Rough advance width of a string in the UI sans.
 *
 * Used to decide whether a label fits before it is drawn — a label that would
 * be clipped by its own mark is dropped to the tooltip and the table instead,
 * never cropped. An estimate is enough for that yes/no call and avoids a
 * layout-thrashing measure pass per mark.
 */
export const approxTextWidth = (text: string, fontSize: number): number =>
	text.length * fontSize * 0.56;

/** Every nth label, so x-axis ticks never collide at narrow widths. */
export const labelStride = (
	count: number,
	plotWidth: number,
	labelWidth: number
): number => {
	if (count === 0 || plotWidth <= 0) return 1;
	const fits = Math.max(1, Math.floor(plotWidth / labelWidth));
	return Math.max(1, Math.ceil(count / fits));
};

/**
 * Keeps a tooltip inside the plot instead of letting it hang off the edge.
 */
export const clampToWidth = (
	desiredLeft: number,
	boxWidth: number,
	containerWidth: number
): number => Math.max(0, Math.min(desiredLeft, containerWidth - boxWidth));

/**
 * Thickness of a bar inside its band: capped by the mark spec, and always
 * leaving the 2px surface gap that separates touching bars.
 */
export const barThickness = (
	band: number,
	maxThickness: number,
	gap: number
): number => Math.max(2, Math.min(maxThickness, band - gap * 2));

/**
 * A bar with a rounded data-end and a square baseline end. Drawn as a path
 * rather than a `<rect rx>` so only the tip is rounded — a rounded baseline
 * detaches the bar from its axis and misreads the value.
 */
export const barPath = (
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
	orientation: 'up' | 'right'
): string => {
	if (height <= 0 || width <= 0) return '';

	if (orientation === 'up') {
		const r = Math.min(radius, width / 2, height);
		return [
			`M${x},${y + height}`,
			`L${x},${y + r}`,
			`Q${x},${y} ${x + r},${y}`,
			`L${x + width - r},${y}`,
			`Q${x + width},${y} ${x + width},${y + r}`,
			`L${x + width},${y + height}`,
			'Z',
		].join(' ');
	}

	const r = Math.min(radius, height / 2, width);
	return [
		`M${x},${y}`,
		`L${x + width - r},${y}`,
		`Q${x + width},${y} ${x + width},${y + r}`,
		`L${x + width},${y + height - r}`,
		`Q${x + width},${y + height} ${x + width - r},${y + height}`,
		`L${x},${y + height}`,
		'Z',
	].join(' ');
};

/** Straight-segment path through a series of points. */
export const linePath = (points: { x: number; y: number }[]): string =>
	points
		.map(
			(point, index) =>
				`${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`
		)
		.join(' ');

/** The line's path closed down to the baseline, for the area wash. */
export const areaPath = (
	points: { x: number; y: number }[],
	baselineY: number
): string => {
	if (points.length === 0) return '';
	const first = points[0];
	const last = points[points.length - 1];
	return `${linePath(points)} L${last.x.toFixed(2)},${baselineY} L${first.x.toFixed(2)},${baselineY} Z`;
};
