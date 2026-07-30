import { create } from 'zustand';

interface StoredUser {
	token: string;
	[key: string]: unknown;
}

interface AuthStore {
	user: StoredUser | null;
	isAuthenticated: boolean;

	setUser: (user: StoredUser) => void;
	logout: () => void;
}

const getStoredUser = (): StoredUser | null => {
	const userString = localStorage.getItem('user');
	if (!userString) return null;

	try {
		return JSON.parse(userString);
	} catch {
		return null;
	}
};

export const useAuthStore = create<AuthStore>((set) => ({
	user: getStoredUser(),
	isAuthenticated: !!getStoredUser()?.token,

	setUser: (user) => {
		localStorage.setItem('user', JSON.stringify(user));
		set({ user, isAuthenticated: !!user.token });
	},

	logout: () => {
		localStorage.removeItem('user');
		set({ user: null, isAuthenticated: false });
	},
}));
