import { LogOut, MapPin, Settings, ShoppingBag } from 'lucide-react';
import type { IProfileSubpagesProps } from '../models/profile-subpages-props.interface';

export const ProfileHome: React.FC<IProfileSubpagesProps> = ({
	onNavigate,
}) => {
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
							<button className='text-aromas_gray_text hover:underline'>
								Cerrar Sesión
							</button>
						</li>
					</ul>
				</div>
			</div>
		</main>
	);
};

export default ProfileHome;
