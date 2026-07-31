import { useSessionExpired } from '@/hooks/useSessionExpired';

/**
 * Mount point for the session-expiry listener. Must live inside the Router so
 * the hook can navigate.
 */
const SessionExpiredWatcher = () => {
	useSessionExpired();
	return null;
};

export default SessionExpiredWatcher;
