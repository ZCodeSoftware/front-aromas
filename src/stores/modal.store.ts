import { create } from 'zustand';

export type ModalType = 'login' | 'signup';

interface ModalStore {
	activeModal: ModalType | null;

	open: (modal: ModalType) => void;
	close: () => void;

	isOpen: (modal: ModalType) => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
	activeModal: null,

	open: (modal) =>
		set({
			activeModal: modal,
		}),

	close: () =>
		set({
			activeModal: null,
		}),

	isOpen: (modal) => get().activeModal === modal,
}));
