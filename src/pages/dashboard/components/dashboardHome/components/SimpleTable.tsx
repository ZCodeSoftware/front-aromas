import { cn } from '@/lib/utils';
import { FOCUS_RING } from '@/lib/a11y';
import { useHorizontalOverflow } from '@/components/charts/chart-hooks';

interface SimpleTableProps {
	/** Read by assistive technology in place of a visible heading. */
	caption: string;
	columns: string[];
	rows: (string | number)[][];
	/** Index from which columns are numeric: right-aligned, tabular figures. */
	numericFrom?: number;
	emptyMessage?: string;
}

/**
 * A table for data whose job is *identity*, not magnitude — a restock list, a
 * roster. Plotting a column of zeroes as bars would be a chart that says
 * nothing; the right form for "which items" is the list of items.
 *
 * Written out rather than reusing the shared shadcn table because that one
 * styles itself with `bg-muted` / `text-muted-foreground` tokens this project
 * never defines, so its header and hover states render with no colour at all.
 */
const SimpleTable = ({
	caption,
	columns,
	rows,
	numericFrom = 1,
	emptyMessage = 'Sin datos.',
}: SimpleTableProps) => {
	const [scrollRef, scrolls] = useHorizontalOverflow<HTMLDivElement>();

	if (rows.length === 0) {
		return (
			<p className='flex min-h-[5rem] items-center justify-center rounded-lg border border-dashed border-aromas_gray_line px-4 py-6 text-center text-sm text-aromas_ink_muted'>
				{emptyMessage}
			</p>
		);
	}

	return (
		<div
			ref={scrollRef}
			role={scrolls ? 'region' : undefined}
			aria-label={
				scrolls ? `${caption}. Desplazable en horizontal.` : undefined
			}
			tabIndex={scrolls ? 0 : undefined}
			className={cn('overflow-x-auto', scrolls && `rounded-md ${FOCUS_RING}`)}>
			<table className='w-full border-collapse text-left text-sm'>
				<caption className='sr-only'>{caption}</caption>
				<thead>
					<tr className='border-b border-aromas_gray_line'>
						{columns.map((column, index) => (
							<th
								key={column}
								scope='col'
								className={cn(
									'px-2 py-2 font-semibold text-aromas_ink',
									index >= numericFrom && 'text-right'
								)}>
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIndex) => (
						<tr
							key={`${String(row[0])}-${rowIndex}`}
							className='border-b border-aromas_gray_line/60 last:border-0'>
							{row.map((cell, index) =>
								index === 0 ? (
									<th
										key={index}
										scope='row'
										className='px-2 py-2 font-medium text-aromas_ink'>
										{cell}
									</th>
								) : (
									<td
										key={index}
										className={cn(
											'px-2 py-2 text-aromas_ink_muted',
											index >= numericFrom &&
												'text-right tabular-nums'
										)}>
										{cell}
									</td>
								)
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SimpleTable;
