import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { useModalStore } from '@/stores/modal.store';
import type { ModalType } from '@/stores/modal.store';

export type ModalAnimation =
	| 'scale'
	| 'fade'
	| 'slide-right'
	| 'slide-left'
	| 'none';

interface Props {
	modal: ModalType;

	children: React.ReactNode;

	size?: 'sm' | 'md' | 'lg' | 'xl';

	showCloseButton?: boolean;

	animation?: ModalAnimation;
}

const sizes = {
	sm: 'sm:max-w-md',
	md: 'sm:max-w-lg',
	lg: 'sm:max-w-2xl',
	xl: 'sm:max-w-4xl',
};

const animations: Record<ModalAnimation, string> = {
	scale: 'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
	fade: 'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
	'slide-right':
		'data-[state=open]:animate-slide-in-from-right data-[state=closed]:animate-slide-out-to-right',
	'slide-left':
		'data-[state=open]:animate-slide-in-from-left data-[state=closed]:animate-slide-out-to-left',
	none: '',
};

const AppModal = ({
	modal,
	children,
	size = 'md',
	showCloseButton = true,
	animation = 'scale',
}: Props) => {
	const { isOpen, close } = useModalStore();

	return (
		<Dialog
			open={isOpen(modal)}
			onOpenChange={(open) => {
				if (!open) close();
			}}>
			<DialogContent
				showCloseButton={showCloseButton}
				animationClassName={animations[animation]}
				className={`
					p-0
					border-none
					shadow-2xl
					rounded-2xl
					overflow-hidden
					${sizes[size]}
				`}>
				<DialogTitle className='hidden'>Modal</DialogTitle>

				{children}
			</DialogContent>
		</Dialog>
	);
};

export default AppModal;
