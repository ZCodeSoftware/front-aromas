import { create } from 'zustand';
import { promotionsGetService } from '@/services/promotions/GET/promotions.service.get';
import type { IPromotionData } from '@/services/promotions/models/promotions.interface';

interface PromotionsStore {
	/** Only the automatic ones: coupons are never exposed publicly. */
	promotions: IPromotionData[];
	isLoading: boolean;
	loaded: boolean;
	fetchActivePromotions: () => Promise<void>;
}

/**
 * The automatic promotions in force, used to show a struck-through price in the
 * grid. Deliberately not persisted: a promotion expires, and a cached copy would
 * advertise a price the checkout then refuses to honour.
 */
export const usePromotionsStore = create<PromotionsStore>()((set, get) => ({
	promotions: [],
	isLoading: false,
	loaded: false,

	fetchActivePromotions: async () => {
		// Once per session is enough, and several cards mount at the same time.
		if (get().loaded || get().isLoading) return;

		set({ isLoading: true });
		try {
			set({
				promotions: await promotionsGetService.getActivePromotions(),
				loaded: true,
			});
		} catch (error) {
			// Silent on purpose: a missing promotion only means the list price is
			// shown, which is never wrong — just less appealing. A toast here would
			// nag the shopper about something they cannot act on.
			console.error('No se pudieron cargar las promociones vigentes.', error);
			set({ loaded: true });
		} finally {
			set({ isLoading: false });
		}
	},
}));
