import { useId, useState, type ReactNode } from 'react';
import { Table2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FOCUS_RING } from '@/lib/a11y';
import { useHorizontalOverflow } from './chart-hooks';

export interface IChartTableData {
	/** Column headers. The first column is the row header. */
	columns: string[];
	/** One array per row, aligned to `columns`. */
	rows: (string | number)[][];
	/** Index from which columns are numeric: right-aligned, tabular figures. */
	numericFrom?: number;
}

interface ChartFigureProps {
	/** Names what is plotted. Shown as the figure caption. */
	title: string;
	/** Optional second line: units, scope, how to read it. */
	description?: string;
	/** The plot. */
	children: ReactNode;
	/** The accessible twin of the chart. Always in the DOM. */
	table: IChartTableData;
	legend?: ReactNode;
	/** Caveats that belong with the data, e.g. what the figure excludes. */
	footnote?: string;
	/** Set when there is nothing to plot. */
	isEmpty?: boolean;
	emptyMessage?: string;
	/** True while a refetch is in flight; holds the frame at reduced opacity. */
	isStale?: boolean;
	className?: string;
}

/**
 * Every chart in this kit is wrapped in one of these, because the wrapper is
 * what makes the chart accessible rather than merely decorative:
 *
 * - a real `<table>` of the same data sits with it, permanently in the
 *   accessibility tree and one button away for sighted readers. That twin is
 *   what lets the palette's lighter hues be used at all (the relief rule for
 *   sub-3:1 fills) and what keeps every value reachable without hovering — a
 *   tooltip may enhance, never gate;
 * - the caption is associated with the figure instead of being a loose heading,
 *   so the card's own heading is not duplicated in the document outline.
 */
const ChartFigure = ({
	title,
	description,
	children,
	table,
	legend,
	footnote,
	isEmpty = false,
	emptyMessage = 'Sin datos para el período seleccionado.',
	isStale = false,
	className,
}: ChartFigureProps) => {
	const [showTable, setShowTable] = useState(false);
	const captionId = useId();
	const tableId = useId();
	const numericFrom = table.numericFrom ?? 1;
	const [scrollRef, scrolls] = useHorizontalOverflow<HTMLDivElement>();
	/* Only a visible, actually-scrolling table earns a tab stop. */
	const isScrollable = showTable && scrolls;

	return (
		<figure
			aria-labelledby={captionId}
			className={cn('viz-root m-0 flex flex-col gap-3', className)}>
			<figcaption id={captionId} className='flex flex-col gap-0.5'>
				<span className='text-sm font-semibold text-aromas_ink'>
					{title}
				</span>
				{description && (
					<span className='text-xs text-aromas_ink_muted'>
						{description}
					</span>
				)}
			</figcaption>

			{isEmpty ? (
				<p className='flex min-h-[8rem] items-center justify-center rounded-lg border border-dashed border-aromas_gray_line px-4 py-8 text-center text-sm text-aromas_ink_muted'>
					{emptyMessage}
				</p>
			) : (
				<>
					<div
						className={cn(
							'transition-opacity',
							isStale && 'opacity-60'
						)}>
						{children}
					</div>
					{legend}
				</>
			)}

			{footnote && (
				<p className='text-xs text-aromas_ink_muted'>{footnote}</p>
			)}

			{!isEmpty && (
				<>
					<div>
						<button
							type='button'
							aria-expanded={showTable}
							aria-controls={tableId}
							onClick={() => setShowTable((open) => !open)}
							className={cn(
								'inline-flex min-h-[24px] items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-aromas_fucsia_ink underline decoration-aromas_fucsia_ink/40 underline-offset-2 hover:bg-aromas_fucsia_ink/10 hover:decoration-aromas_fucsia_ink',
								FOCUS_RING
							)}>
							{showTable ? (
								<X aria-hidden='true' className='size-3.5' />
							) : (
								<Table2 aria-hidden='true' className='size-3.5' />
							)}
							{showTable
								? 'Ocultar tabla de datos'
								: 'Ver datos en tabla'}
						</button>
					</div>

					{/*
					 * Never conditionally rendered: collapsing it to `sr-only`
					 * keeps it in the accessibility tree at all times, so a
					 * screen-reader user reaches the numbers without having to
					 * find and press the toggle first.
					 */}
					<div
						id={tableId}
						ref={scrollRef}
						role={isScrollable ? 'region' : undefined}
						aria-label={
							isScrollable
								? `Tabla de datos: ${title}. Desplazable en horizontal.`
								: undefined
						}
						tabIndex={isScrollable ? 0 : undefined}
						className={cn(
							/*
							 * The scroll container only exists while the table
							 * is shown. Left on, it combined with `sr-only`'s
							 * 1px box into a permanently overflowing region
							 * that no keyboard could reach — a scroll container
							 * nobody could see, let alone scroll.
							 */
							showTable && 'overflow-x-auto',
							isScrollable && `rounded-md ${FOCUS_RING}`,
							!showTable && 'sr-only viz-table-collapsed'
						)}>
						<table className='w-full border-collapse text-left text-xs'>
							<caption className='sr-only'>
								{`Tabla de datos: ${title}`}
								{description ? `. ${description}` : ''}
							</caption>
							<thead>
								<tr className='border-b border-aromas_gray_line'>
									{table.columns.map((column, index) => (
										<th
											key={column}
											scope='col'
											className={cn(
												'px-2 py-1.5 font-semibold text-aromas_ink',
												index >= numericFrom &&
													'text-right'
											)}>
											{column}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{table.rows.map((row, rowIndex) => (
									<tr
										key={`${String(row[0])}-${rowIndex}`}
										className='border-b border-aromas_gray_line/60 last:border-0'>
										{row.map((cell, index) =>
											index === 0 ? (
												<th
													key={index}
													scope='row'
													className='px-2 py-1.5 font-medium text-aromas_ink'>
													{cell}
												</th>
											) : (
												<td
													key={index}
													className={cn(
														'px-2 py-1.5 text-aromas_ink_muted',
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
				</>
			)}
		</figure>
	);
};

export default ChartFigure;
