import { create } from 'zustand';
import type { StoreCardFilter } from '@/pages/home/components/products-view/models/store-card.interface';

interface StorefrontStore {
	/** Category picked from the navbar, or null for the whole catalogue. */
	categoryId: string | null;
	categoryName: string | null;
	selectCategory: (categoryId: string, categoryName: string) => void;
	clearCategory: () => void;
	/** Products, combos or both: driven by the navbar and the grid's own tabs. */
	kind: StoreCardFilter;
	selectKind: (kind: StoreCardFilter) => void;
}

/**
 * Bridges the navbar and the product grid, which sit in different branches of the
 * tree with no route between them: the shop is a single-route SPA, so a category
 * link cannot navigate anywhere and has to drive the grid through shared state.
 *
 * Deliberately not persisted: a category chosen a week ago should not silently
 * narrow the catalogue on the next visit.
 */
export const useStorefrontStore = create<StorefrontStore>()((set) => ({
	categoryId: null,
	categoryName: null,

	selectCategory: (categoryId, categoryName) =>
		set({ categoryId, categoryName }),

	clearCategory: () => set({ categoryId: null, categoryName: null }),

	kind: 'all',

	selectKind: (kind) => set({ kind }),
}));

/** Scrolls the grid into view, the same way the hero button does. */
export const scrollToProducts = (): void => {
	document
		.getElementById('products-section')
		?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
