import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
	notifySessionExpired,
	subscribeToSessionExpired,
} from '@/services/session-expired';
import { isJwtExpired } from '@/lib/jwt';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useModalStore } from '@/stores/modal.store';
import { HOME_ROUTE } from '@/config/routes';

/**
 * Reacts to an expired/rejected token: clears the session and opens the login
 * modal. Routes back to Home first when the user is on a page that doesn't
 * mount the auth modals (the dashboard), so the modal is actually visible.
 */
export const useSessionExpired = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(
		() =>
			subscribeToSessionExpired(() => {
				const { isAuthenticated, logout } = useAuthStore.getState();
				// Already handled by an earlier 401 of the same burst.
				if (!isAuthenticated) return;

				logout();
				useCartStore.getState().resetLocalCart();
				useModalStore.getState().open('login');
				toast.error(
					'Tu sesión expiró. Inicia sesión de nuevo para continuar.',
				);

				if (pathname !== HOME_ROUTE) {
					navigate(HOME_ROUTE, { replace: true });
				}
			}),
		[navigate, pathname],
	);

	// Runs after the listener above is registered: catches the case where the
	// stored token expired while the app was closed, so the UI never starts up
	// pretending the user is still signed in.
	useEffect(() => {
		const token = useAuthStore.getState().user?.token;
		if (token && isJwtExpired(token)) notifySessionExpired();
	}, []);
};
