export interface IAnchorRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface IViewport {
	width: number;
	height: number;
}

export const CARD_WIDTH = 380;
/** Distance between the highlighted control and the step card. */
const GAP = 14;
/** Minimum breathing room against the edges of the viewport. */
const MARGIN = 12;

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), Math.max(min, max));

export const getCardWidth = (viewport: IViewport) =>
	Math.min(CARD_WIDTH, viewport.width - MARGIN * 2);

/**
 * Places the step card next to the highlighted control: below it when there is
 * room, above it otherwise. Steps with nothing to highlight — the contents of a
 * modal, for instance — sit at the bottom, where they are least likely to cover
 * whatever the admin has just opened.
 */
export const resolveCardPosition = (
	anchor: IAnchorRect | null,
	cardHeight: number,
	viewport: IViewport
): { top: number; left: number } => {
	const width = getCardWidth(viewport);
	const centeredLeft = (viewport.width - width) / 2;
	const lowestTop = viewport.height - cardHeight - MARGIN;

	if (!anchor) {
		return { top: Math.max(MARGIN, lowestTop), left: centeredLeft };
	}

	const below = anchor.top + anchor.height + GAP;
	const above = anchor.top - cardHeight - GAP;

	let top: number;
	if (below <= lowestTop) {
		top = below;
	} else if (above >= MARGIN) {
		top = above;
	} else {
		top = clamp((viewport.height - cardHeight) / 2, MARGIN, lowestTop);
	}

	return {
		top,
		left: clamp(
			anchor.left + anchor.width / 2 - width / 2,
			MARGIN,
			viewport.width - width - MARGIN
		),
	};
};

export const sameRect = (
	a: IAnchorRect | null,
	b: IAnchorRect | null
): boolean => {
	if (!a || !b) return a === b;
	return (
		a.top === b.top &&
		a.left === b.left &&
		a.width === b.width &&
		a.height === b.height
	);
};
