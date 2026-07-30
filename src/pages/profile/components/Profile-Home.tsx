import { LayoutDashboard, LogOut, MapPin, Settings, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IProfileSubpagesProps } from '../models/profile-subpages-props.interface';
import type { IUserProfile } from '@/services/user/models/user.interface';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { toast } from 'sonner';
import { DASHBOARD_ROUTE } from '@/config/routes';

interface ProfileHomeProps extends IProfileSubpagesProps {
	profile: IUserProfile | null;
}

export const ProfileHome: React.FC<ProfileHomeProps> = ({
	onNavigate,
	setIsClosing,
	onClose,
	profile,
}) => {
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);
	const resetLocalCart = useCartStore((state) => state.resetLocalCart);
	const isAdmin = profile?.roles.some((role) => role.name === 'ADMIN');
	const handleLogout = () => {
		logout();
		resetLocalCart();
		toast.success('Hasta luego. ¡Te esperamos pronto!');
		if (setIsClosing) setIsClosing(true);
		if (onClose) setTimeout(() => onClose(), 200);
	};

	return (
		<main className='flex-1 p-6 overflow-y-auto'>
			<div className='mb-6'>
				<div className='flex flex-wrap gap-2'>
					<ul className='flex flex-col flex-wrap gap-y-10'>
						<li className='flex gap-x-4'>
							<ShoppingBag className='text-aromas_fucsia' />
							<button
								onClick={() => onNavigate('orders')}
								className='text-aromas_gray_text hover:underline'>
								Mis Pedidos
							</button>
						</li>
						<li className='flex gap-x-4'>
							<MapPin className='text-aromas_fucsia' />
							<button
								onClick={() => onNavigate('addresses')}
								className='text-aromas_gray_text hover:underline'>
								Mis Direcciones
							</button>
						</li>
						<li className='flex gap-x-4'>
							<Settings className='text-aromas_fucsia' />
							<button
								onClick={() => onNavigate('settings')}
								className='text-aromas_gray_text hover:underline'>
								Configuración
							</button>
						</li>
						<li className='flex gap-x-4'>
							<LogOut className='text-aromas_fucsia' />
							<button
								onClick={handleLogout}
								className='text-aromas_gray_text hover:underline'>
								Cerrar Sesión
							</button>
						</li>
					</ul>
				</div>
				{isAdmin && (
					<div className='mt-10 pt-6 flex gap-x-4 border-t border-aromas_gray_line'>
						<LayoutDashboard className='text-aromas_fucsia' />
						<button
							onClick={() => navigate(DASHBOARD_ROUTE)}
							className='text-aromas_gray_text hover:underline'>
							Panel de administración
						</button>
					</div>
				)}
			</div>
		</main>
	);
};

export default ProfileHome;
