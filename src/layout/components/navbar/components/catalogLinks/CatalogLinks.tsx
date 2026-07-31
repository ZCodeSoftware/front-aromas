import {
	scrollToProducts,
	useStorefrontStore,
} from '@/stores/storefront.store';
import type { StoreCardFilter } from '@/pages/home/components/products-view/models/store-card.interface';

interface ICatalogLinksProps {
	/** Wraps each entry, so the desktop nav and the mobile menu keep their layout. */
	renderItem: (link: React.ReactNode, key: string) => React.ReactNode;
	className?: string;
	/** Called after an entry is picked, to close the mobile menu. */
	onSelect?: () => void;
}

const LINKS: { kind: Exclude<StoreCardFilter, 'all'>; label: string }[] = [
	{ kind: 'products', label: 'Productos' },
	{ kind: 'combos', label: 'Combos' },
];

/**
 * The two shortcuts of the nav. Picking one switches the storefront grid to that
 * kind and scrolls to it: there is no route to navigate to in a single-route SPA.
 */
const CatalogLinks: React.FC<ICatalogLinksProps> = ({
	renderItem,
	className = 'text-aromas_gray_text hover:text-gray-900',
	onSelect,
}) => {
	const selectedKind = useStorefrontStore((state) => state.kind);
	const selectKind = useStorefrontStore((state) => state.selectKind);

	const handleClick = (kind: Exclude<StoreCardFilter, 'all'>) => {
		// Clicking the active entry again goes back to the whole catalogue, which is
		// the only way to undo the choice from the nav itself.
		selectKind(selectedKind === kind ? 'all' : kind);
		scrollToProducts();
		onSelect?.();
	};

	return (
		<>
			{LINKS.map(({ kind, label }) =>
				renderItem(
					<button
						type='button'
						onClick={() => handleClick(kind)}
						aria-pressed={selectedKind === kind}
						className={`${className} ${
							selectedKind === kind
								? 'font-bold text-aromas_fucsia'
								: ''
						}`}>
						{label}
					</button>,
					kind
				)
			)}
		</>
	);
};

export default CatalogLinks;
