/**
 * Bridge between the axios interceptors (plain modules, no React context) and
 * the component tree, which is the only place that can close the session and
 * route the user to the login modal.
 *
 * Deliberately free of store/component imports: the interceptors are loaded by
 * every service module, so importing stores here would create a cycle.
 */
type SessionExpiredListener = () => void;

const listeners = new Set<SessionExpiredListener>();

export const subscribeToSessionExpired = (
	listener: SessionExpiredListener,
): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

/**
 * Announces that the stored token is no longer usable. Safe to call several
 * times for a burst of parallel 401s: the listener bails out once the session
 * has already been closed.
 */
export const notifySessionExpired = (): void => {
	listeners.forEach((listener) => listener());
};
