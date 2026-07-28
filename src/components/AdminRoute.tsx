import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { userGetService } from '@/services/user/GET/user.service.get';
import { HOME_ROUTE } from '@/config/routes';

interface AdminRouteProps {
	children: React.ReactNode;
}

/**
 * Gates a route behind the ADMIN role. Roles are re-checked against
 * GET /user/detail (server-verified from the JWT) instead of the cached
 * login payload in localStorage, since that cache is client-editable and
 * can't be trusted to decide access on its own.
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>(
		'checking'
	);

	useEffect(() => {
		if (!isAuthenticated) {
			setStatus('denied');
			return;
		}

		let cancelled = false;
		userGetService
			.getMyProfile()
			.then((profile) => {
				if (cancelled) return;
				const isAdmin = profile.roles.some(
					(role) => role.name === 'ADMIN'
				);
				setStatus(isAdmin ? 'allowed' : 'denied');
			})
			.catch(() => {
				if (!cancelled) setStatus('denied');
			});

		return () => {
			cancelled = true;
		};
	}, [isAuthenticated]);

	if (status === 'checking') {
		return (
			<div className='flex h-screen w-full items-center justify-center text-aromas_gray_text'>
				Verificando acceso...
			</div>
		);
	}

	if (status === 'denied') {
		return <Navigate to={HOME_ROUTE} replace />;
	}

	return <>{children}</>;
};

export default AdminRoute;
