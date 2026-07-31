import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IProductsPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

/** Page numbers around the current one, with ellipses when the range is cut. */
const pageWindow = (currentPage: number, totalPages: number): (number | '…')[] => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const pages: (number | '…')[] = [1];
	const from = Math.max(2, currentPage - 1);
	const to = Math.min(totalPages - 1, currentPage + 1);

	if (from > 2) pages.push('…');
	for (let page = from; page <= to; page += 1) pages.push(page);
	if (to < totalPages - 1) pages.push('…');

	pages.push(totalPages);

	return pages;
};

const ProductsPagination: React.FC<IProductsPaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	// A single page needs no controls, and zero means nothing was found.
	if (totalPages <= 1) return null;

	const buttonClass =
		'flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-300 px-2 text-sm text-aromas_gray_text transition-colors hover:border-aromas_fucsia hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';

	return (
		<nav
			className='mt-10 flex items-center justify-center gap-2'
			aria-label='Paginación de productos'>
			<button
				type='button'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				aria-label='Página anterior'
				className={buttonClass}>
				<ChevronLeft className='h-4 w-4' />
			</button>

			{pageWindow(currentPage, totalPages).map((page, index) =>
				page === '…' ? (
					<span
						key={`gap-${index}`}
						aria-hidden='true'
						className='px-1 text-aromas_gray_text'>
						…
					</span>
				) : (
					<button
						key={page}
						type='button'
						onClick={() => onPageChange(page)}
						aria-label={`Página ${page}`}
						aria-current={page === currentPage ? 'page' : undefined}
						className={`${buttonClass} ${
							page === currentPage
								? 'border-aromas_fucsia bg-aromas_pink font-bold'
								: ''
						}`}>
						{page}
					</button>
				)
			)}

			<button
				type='button'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				aria-label='Página siguiente'
				className={buttonClass}>
				<ChevronRight className='h-4 w-4' />
			</button>
		</nav>
	);
};

export default ProductsPagination;
