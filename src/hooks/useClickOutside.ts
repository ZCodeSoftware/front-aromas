import { useEffect } from 'react';
import type { RefObject } from 'react';

export const useClickOutside = <T extends HTMLElement>(
	ref: RefObject<T | null>,
	callback: () => void
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, callback]);
};
