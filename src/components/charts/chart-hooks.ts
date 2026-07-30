import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Measures the container so charts can be drawn at 1:1 CSS pixels instead of
 * being scaled by a viewBox. Scaling an SVG shrinks its text with it, which
 * breaks both "resize text" and "reflow" once the card gets narrow; drawing at
 * the real width keeps every label at its declared size at any zoom level.
 */
export const useContainerWidth = <T extends HTMLElement>() => {
	const ref = useRef<T | null>(null);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		if (typeof ResizeObserver === 'undefined') {
			setWidth(node.clientWidth);
			return;
		}

		const observer = new ResizeObserver((entries) => {
			const measured = entries[0]?.contentRect.width;
			if (typeof measured === 'number') setWidth(Math.round(measured));
		});

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return [ref, width] as const;
};

/**
 * Whether a container is actually scrolling horizontally.
 *
 * A scrollable region has to be reachable by keyboard, or the content past the
 * right edge is mouse-only (WCAG 2.1.1). The check is live rather than assumed,
 * because giving every table wrapper a permanent tab stop would litter the tab
 * order of a dashboard with a dozen tables on the wide layouts where nothing
 * overflows in the first place.
 */
export const useHorizontalOverflow = <T extends HTMLElement>() => {
	const ref = useRef<T | null>(null);
	const [overflows, setOverflows] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const measure = () =>
			setOverflows(node.scrollWidth > node.clientWidth + 1);

		measure();

		if (typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver(measure);
		// Observing the child too: a table swapped out of `sr-only` changes its
		// own width, and the wrapper only follows once the child has resized.
		observer.observe(node);
		if (node.firstElementChild) observer.observe(node.firstElementChild);

		return () => observer.disconnect();
	}, []);

	return [ref, overflows] as const;
};

export interface IChartCursor {
	/** Index the pointer or the keyboard is currently resting on. */
	index: number | null;
	setIndex: (next: number | null) => void;
	/** Spread onto the single focusable element that wraps the plot. */
	keyboardProps: {
		tabIndex: 0;
		onKeyDown: (event: React.KeyboardEvent) => void;
		onFocus: () => void;
		onBlur: () => void;
	};
	/** Rendered into a polite live region so focus changes are spoken. */
	announcement: string;
}

/**
 * One tab stop per chart, arrow keys inside it.
 *
 * Making every bar focusable floods the tab order of a dashboard that already
 * has dozens of marks per view, so the plot takes a single stop and the arrows
 * walk the data from there — the pattern assistive-technology users expect from
 * a chart. Keyboard focus surfaces exactly what hover does, and the figure's
 * table twin still carries every value for readers who never move the cursor.
 */
export const useChartCursor = (
	count: number,
	describe: (index: number) => string
): IChartCursor => {
	const [index, setIndex] = useState<number | null>(null);

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (count === 0) return;

			const step = (delta: number) => {
				event.preventDefault();
				setIndex((current) => {
					if (current === null) return delta > 0 ? 0 : count - 1;
					return Math.min(count - 1, Math.max(0, current + delta));
				});
			};

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					step(1);
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
					step(-1);
					break;
				case 'Home':
					event.preventDefault();
					setIndex(0);
					break;
				case 'End':
					event.preventDefault();
					setIndex(count - 1);
					break;
				case 'Escape':
					setIndex(null);
					break;
				default:
					break;
			}
		},
		[count]
	);

	const onFocus = useCallback(() => {
		setIndex((current) => (current === null && count > 0 ? 0 : current));
	}, [count]);

	const onBlur = useCallback(() => setIndex(null), []);

	// An index can outlive the data it pointed at when a filter shrinks the set.
	useEffect(() => {
		setIndex((current) =>
			current !== null && current > count - 1 ? null : current
		);
	}, [count]);

	return {
		index,
		setIndex,
		keyboardProps: { tabIndex: 0, onKeyDown, onFocus, onBlur },
		announcement: index === null ? '' : describe(index),
	};
};
