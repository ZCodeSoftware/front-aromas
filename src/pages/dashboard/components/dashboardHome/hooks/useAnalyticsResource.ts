import { useCallback, useEffect, useRef, useState } from 'react';

export type ResourceStatus = 'loading' | 'refreshing' | 'ready' | 'error';

interface IResource<T> {
	data: T | null;
	status: ResourceStatus;
	/** Re-runs `load` without clearing what is already on screen. */
	retry: () => void;
}

/**
 * One fetch, four states, previous render kept.
 *
 * `refreshing` exists so changing the period does not flash a skeleton: the
 * charts hold their last frame at reduced opacity instead of collapsing and
 * reflowing the page, which is both calmer and stops the focus ring from
 * jumping when a keyboard user re-filters. A stale response from a period the
 * reader already moved away from is dropped by the request token.
 *
 * `load` must be memoised by the caller — it is the dependency that decides
 * when a refetch happens.
 */
export const useAnalyticsResource = <T,>(
	load: () => Promise<T>
): IResource<T> => {
	const [data, setData] = useState<T | null>(null);
	const [status, setStatus] = useState<ResourceStatus>('loading');
	const [attempt, setAttempt] = useState(0);
	const latestRequest = useRef(0);

	useEffect(() => {
		const token = ++latestRequest.current;
		let isCurrent = true;

		setStatus((current) => (current === 'ready' ? 'refreshing' : 'loading'));

		load()
			.then((result) => {
				if (!isCurrent || token !== latestRequest.current) return;
				setData(result);
				setStatus('ready');
			})
			.catch((error: unknown) => {
				console.error('Error fetching analytics resource:', error);
				if (!isCurrent || token !== latestRequest.current) return;
				setStatus('error');
			});

		return () => {
			isCurrent = false;
		};
	}, [load, attempt]);

	const retry = useCallback(() => setAttempt((count) => count + 1), []);

	return { data, status, retry };
};
