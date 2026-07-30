/**
 * Shared accessibility utilities.
 *
 * The focus ring is a single constant rather than a per-component decision so
 * every interactive element in the metrics section is reachable *and* visibly
 * focused (WCAG 2.4.7 / 2.4.11). It is drawn with `focus-visible` so a mouse
 * click does not leave a ring behind, and with an offset so the ring never
 * merges into the control's own border.
 */
export const FOCUS_RING =
	'outline-none focus-visible:ring-2 focus-visible:ring-aromas_fucsia_ink focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/** WCAG 2.5.8 target size: no pointer target below 24x24 CSS pixels. */
export const MIN_TARGET = 'min-h-[24px] min-w-[24px]';
