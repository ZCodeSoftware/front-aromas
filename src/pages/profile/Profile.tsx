import { useState, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

import ProfileHome from './components/Profile-Home';
import ProfileOrders from './components/Profile-Orders';
import ProfileConfig from './components/Profile-Config';
import ProfileLocationsView from './components/profile-locations/components/Profile-Locations-View';
import ProfileCreateLocation from './components/profile-locations/components/Profile-Create-Location';
import ProfileUpdateLocation from './components/profile-locations/components/Profile-Update-Location';

import type { IProfileView } from './types/profile-view';
import type { IProfileProps } from './models/profile-props.interface';

const Profile: React.FC<IProfileProps> = ({ onClose }) => {
	const [isClosing, setIsClosing] = useState(false);
	const [currentView, setCurrentView] = useState<IProfileView>('home');
	const [exitingView, setExitingView] = useState<IProfileView | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => onClose(), 200);
	};

	useClickOutside(modalRef, handleClose);

	const navigateTo = (view: IProfileView) => {
		if (view === currentView) return;
		setExitingView(currentView);
		setCurrentView(view);
		setTimeout(() => setExitingView(null), 300);
	};

	const getAnimationClass = (isExiting: boolean) => {
		const isMovingToSubView =
			['addressCreate', 'addressUpdate'].includes(currentView) &&
			exitingView === 'addresses';
		const isMovingFromSubView =
			currentView === 'addresses' &&
			['addressCreate', 'addressUpdate'].includes(exitingView!);
		const isMovingToMainView =
			currentView !== 'home' &&
			exitingView === 'home' &&
			!isMovingFromSubView;
		const isMovingToHome =
			currentView === 'home' &&
			exitingView !== 'home' &&
			!isMovingToSubView;

		const isNavigatingForward = isMovingToMainView || isMovingToSubView;
		const isNavigatingBackward = isMovingToHome || isMovingFromSubView;

		if (isExiting) {
			return isNavigatingForward
				? 'animate-slide-out-to-left'
				: 'animate-slide-out-to-right';
		}
		if (isNavigatingForward) return 'animate-slide-in-from-right';
		if (isNavigatingBackward) return 'animate-slide-in-from-left';
		return '';
	};

	const renderView = (view: IProfileView, isExiting: boolean) => {
		const animationClass = getAnimationClass(isExiting);
		const componentToRender = () => {
			switch (view) {
				case 'orders':
					return <ProfileOrders />;
				case 'settings':
					return <ProfileConfig />;
				case 'addresses':
					return <ProfileLocationsView onNavigate={navigateTo} />;
				case 'addressCreate':
					return <ProfileCreateLocation onNavigate={navigateTo} />;
				case 'addressUpdate':
					return <ProfileUpdateLocation onNavigate={navigateTo} />;
				default:
					return <ProfileHome onNavigate={navigateTo} />;
			}
		};
		return (
			<div
				className={`absolute w-full h-full bg-white overflow-y-auto ${animationClass}`}>
				{componentToRender()}
			</div>
		);
	};

	const getTitle = () => {
		switch (currentView) {
			case 'orders':
				return 'Mis Pedidos';
			case 'addresses':
				return 'Mis Direcciones';
			case 'settings':
				return 'Configuración';
			case 'addressCreate':
				return 'Nueva Dirección';
			case 'addressUpdate':
				return 'Editar Dirección';
			default:
				return 'Mi Perfil';
		}
	};

	const getBackDestination = (): IProfileView => {
		return ['addressCreate', 'addressUpdate'].includes(currentView)
			? 'addresses'
			: 'home';
	};

	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end ${
				isClosing ? 'animate-fade-out' : 'animate-fade-in'
			}`}>
			<div
				ref={modalRef}
				className={`w-full max-w-md bg-white h-full flex flex-col shadow-xl overflow-hidden ${
					isClosing
						? 'animate-slide-out-to-right'
						: 'animate-slide-in-from-right'
				}`}>
				<header className='flex items-center justify-between px-4 flex-col'>
					<div className='flex items-center justify-between w-full py-4 border-b-2 border-aromas_gray_line'>
						<div className='flex items-center gap-4'>
							<h2 className='text-xl font-bold text-aromas_gray_text'>
								Mi Perfil
							</h2>
						</div>
						<button
							onClick={handleClose}
							className='p-1 rounded-full hover:bg-gray-200 self-start'>
							<X className='h-6 w-6 text-aromas_gray_text' />
						</button>
					</div>
					<div className='w-full py-4 flex items-center justify-between'>
						{currentView === 'home' ? (
							<div className='flex items-center gap-4 w-full'>
								<span>Imagen</span>
								<div className='flex flex-col'>
									<h2 className='text-aromas_gray_text'>
										Nombre de Usuario
									</h2>
									<h3 className='text-sm text-gray-500'>
										Email de Usuario
									</h3>
								</div>
							</div>
						) : (
							<div className='flex justify-start flex-col pb-4 gap-y-1 border-b-2 border-aromas_gray_line w-full'>
								<button
									onClick={() =>
										navigateTo(getBackDestination())
									}
									className='flex items-center gap-x-1 text-aromas_fucsia'>
									<ArrowLeft className='h-4 w-4' />
									<span>volver</span>
								</button>
								<h2 className='text-xl font-bold text-aromas_gray_text'>
									{getTitle()}
								</h2>
							</div>
						)}
					</div>
				</header>

				<div className='relative flex-1'>
					{renderView(currentView, false)}
					{exitingView && renderView(exitingView, true)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
