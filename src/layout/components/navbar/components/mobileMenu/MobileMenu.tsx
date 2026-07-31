import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import CatalogLinks from '../catalogLinks/CatalogLinks';

interface MobileMenuProps {
	onClose: () => void;
}

const MobileMenu = ({ onClose }: MobileMenuProps) => {
	const [isClosing, setIsClosing] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => {
		setIsClosing(true);
		setTimeout(onClose, 200);
	}, [onClose]);

	useClickOutside(panelRef, handleClose);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') handleClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleClose]);

	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-start ${
				isClosing ? 'animate-fade-out' : 'animate-fade-in'
			}`}
			role='dialog'
			aria-modal='true'
			aria-label='Menú de navegación'>
			<div
				ref={panelRef}
				className={`w-full max-w-xs bg-aromas_nav_bg h-full flex flex-col shadow-xl ${
					isClosing
						? 'animate-slide-out-to-left'
						: 'animate-slide-in-from-left'
				}`}>
				<header className='flex items-center justify-between px-4 py-4 border-b border-aromas_gray_line'>
					<span className='text-lg font-bold text-aromas_fucsia'>
						Aromas y Armonía
					</span>
					<button
						type='button'
						onClick={handleClose}
						aria-label='Cerrar menú'
						className='p-1 rounded-full hover:bg-gray-200'>
						<X className='h-6 w-6 text-aromas_gray_text' />
					</button>
				</header>
				<nav className='flex flex-col p-4'>
					<a
						href='/'
						onClick={handleClose}
						className='py-3 text-lg text-aromas_gray_text hover:text-gray-900 border-b border-aromas_gray_line/60'>
						Inicio
					</a>
					<CatalogLinks
						className='w-full py-3 text-left text-lg text-aromas_gray_text hover:text-gray-900 border-b border-aromas_gray_line/60'
						onSelect={handleClose}
						renderItem={(link, key) => (
							<div key={key} className='contents'>
								{link}
							</div>
						)}
					/>
				</nav>
			</div>
		</div>
	);
};

export default MobileMenu;
