import { useState, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import ProfileHome from './components/Profile-Home';
import ProfileOrders from './components/Profile-Orders';
import type { IProfileProps } from './models/profile-props.interface';
import type { IProfileView } from './types/profile-view';
import ProfileConfig from './components/Profile-Config';
import ProfileLocations from './components/profile-locations/Profile-Locations';

const Profile: React.FC<IProfileProps> = ({ onClose }) => {
	const [isClosing, setIsClosing] = useState(false);
	const [currentView, setCurrentView] = useState<IProfileView>('home');
	const [exitingView, setExitingView] = useState<IProfileView | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);

		setTimeout(() => {
			onClose();
			setIsClosing(false);
		}, 200);
	};

	useClickOutside(modalRef, handleClose);

	const navigateTo = (view: IProfileView) => {
		if (view === currentView) return;

		setExitingView(currentView);
		setCurrentView(view);

		setTimeout(() => {
			setExitingView(null);
		}, 300);
	};

	const renderView = (view: IProfileView, isExiting: boolean) => {
		const isNavigatingForward =
			currentView !== 'home' && (exitingView === 'home' || !exitingView);
		const isNavigatingBackward =
			currentView === 'home' && exitingView !== 'home';

		let animationClass = '';
		if (isExiting) {
			animationClass = isNavigatingForward
				? 'animate-slide-out-to-left'
				: 'animate-slide-out-to-right';
		} else {
			animationClass = isNavigatingForward
				? 'animate-slide-in-from-right'
				: isNavigatingBackward
				? 'animate-slide-in-from-left'
				: '';
		}

		const componentToRender = () => {
			switch (view) {
				case 'orders':
					return <ProfileOrders />;
				case 'settings':
					return <ProfileConfig />;
				case 'addresses':
					return <ProfileLocations />;
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
				return (
					<h2 className='font-semibold text-aromas_gray_text'>
						Mis Pedidos
					</h2>
				);
			case 'addresses':
				return (
					<h2 className='font-semibold text-aromas_gray_text'>
						Mis Direcciones
					</h2>
				);
			case 'settings':
				return (
					<h2 className='font-semibold text-aromas_gray_text'>
						Configuración
					</h2>
				);
			default:
				return (
					<h2 className='font-semibold text-aromas_gray_text'>
						Mi Perfil
					</h2>
				);
		}
	};

	const renderHeaderContent = (view: IProfileView, isExiting: boolean) => {
		const animationClass = isExiting
			? 'animate-fade-out'
			: 'animate-fade-in';
		const content =
			view !== 'home' ? (
				<div className='flex flex-col gap-y-2'>
					<div className='flex items-center gap-x-1'>
						<ArrowLeft className='h-4 w-4 text-aromas_fucsia' />
						<button
							onClick={() => navigateTo('home')}
							className='text-aromas_fucsia'>
							volver
						</button>
					</div>
					{getTitle()}
				</div>
			) : (
				<div className='flex items-center gap-4 py-2 w-full'>
					<span>Imagen</span>
					<div className='flex flex-col'>
						<h2 className='text-aromas_gray_text'>
							Nombre de Usuario
						</h2>
						<h3 className='text-aromas_gray_text'>
							Email de Usuario
						</h3>
					</div>
				</div>
			);
		return (
			<div
				className={`absolute w-full h-full flex items-center ${animationClass}`}>
				{content}
			</div>
		);
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
				<header className='flex items-center justify-between p-4'>
					<div className='flex items-center gap-4'>
						<h2 className='text-xl font-bold text-aromas_gray_text'>
							Mi Perfil
						</h2>
					</div>
					<button
						onClick={handleClose}
						className='p-1 rounded-full hover:bg-gray-200'>
						<X className='h-6 w-6 text-aromas_gray_text' />
					</button>
				</header>
				<div
					className={`relative flex flex-col justify-center border-t-2 ${
						currentView != 'home' && 'border-b-2'
					} border-aromas_gray_line py-4 px-6 mb-2 h-28`}>
					{renderHeaderContent(currentView, false)}

					{exitingView && renderHeaderContent(exitingView, true)}
				</div>
				<div className='relative flex-1'>
					{renderView(currentView, false)}

					{exitingView && renderView(exitingView, true)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
