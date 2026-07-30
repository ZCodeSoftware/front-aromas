import { useEffect } from 'react';
import type { RefObject } from 'react';

export const useClickOutside = <T extends HTMLElement>(
	ref: RefObject<T | null>,
	callback: () => void,
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const clickedInsidePortal = event
				.composedPath()
				.some(
					(node) =>
						node instanceof Element &&
						node.hasAttribute('data-radix-popper-content-wrapper'),
				);
			if (clickedInsidePortal) return;

			if (document.body.style.pointerEvents === 'none') return;

			const target = event.target as Node;
			if (ref.current && !ref.current.contains(target)) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, callback]);
};
