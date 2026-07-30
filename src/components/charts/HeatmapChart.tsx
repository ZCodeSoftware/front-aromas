import { useId } from 'react';
import { cn } from '@/lib/utils';
import { FOCUS_RING } from '@/lib/a11y';
import { useHorizontalOverflow } from './chart-hooks';
import { ORDINAL_STEPS, magnitudeStep } from './chart-tokens';

interface HeatmapChartProps {
	title: string;
	description?: string;
	footnote?: string;
	/** Row header text, e.g. "Canal". */
	rowHeader: string;
	rowLabels: string[];
	columnLabels: string[];
	/** `values[row][column]`, or null for a combination with no data. */
	values: (number | null)[][];
	formatValue: (value: number) => string;
	/** Compact form printed inside the cells. */
	formatCell?: (value: number) => string;
	summary: string;
	isStale?: boolean;
	emptyMessage?: string;
}

/**
 * A grid of magnitudes, built as a real `<table>`.
 *
 * This is the one chart form whose accessible twin *is* the chart: proper
 * `<th scope>` headers give every cell its row and column in the accessibility
 * tree, and each cell prints its own value. The colour ramp is therefore purely
 * supplementary — it survives a forced-colours theme losing every background,
 * and it needs no hover layer to be readable.
 */
const HeatmapChart = ({
	title,
	description,
	footnote,
	rowHeader,
	rowLabels,
	columnLabels,
	values,
	formatValue,
	formatCell,
	summary,
	isStale = false,
	emptyMessage = 'Sin datos para el período seleccionado.',
}: HeatmapChartProps) => {
	const captionId = useId();
	const [scrollRef, scrolls] = useHorizontalOverflow<HTMLDivElement>();
	const cellFormatter = formatCell ?? formatValue;
	const flat = values.flat().filter((value): value is number => value !== null);
	const maxValue = Math.max(0, ...flat);
	const isEmpty = rowLabels.length === 0 || columnLabels.length === 0;

	return (
		<figure
			aria-labelledby={captionId}
			className='viz-root m-0 flex flex-col gap-3'>
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
				<p className='flex min-h-[6rem] items-center justify-center rounded-lg border border-dashed border-aromas_gray_line px-4 py-6 text-center text-sm text-aromas_ink_muted'>
					{emptyMessage}
				</p>
			) : (
				<>
					{/*
					 * The grid keeps a minimum width, so on a phone it scrolls
					 * — which makes it a scrollable region that has to be
					 * reachable by keyboard, not only by dragging.
					 */}
					<div
						ref={scrollRef}
						role={scrolls ? 'region' : undefined}
						aria-label={
							scrolls
								? `${title}. Desplazable en horizontal.`
								: undefined
						}
						tabIndex={scrolls ? 0 : undefined}
						className={cn(
							'overflow-x-auto transition-opacity',
							scrolls && `rounded-md ${FOCUS_RING}`,
							isStale && 'opacity-60'
						)}>
						{/*
						 * `table-fixed` equalises the data columns. With
						 * auto layout a column sized itself to its header, so
						 * cells in different columns had different widths and
						 * the grid invited the reader to compare *width* —
						 * which encodes nothing here. The min-width keeps that
						 * from squeezing into unreadable columns on a phone;
						 * the container scrolls instead.
						 */}
						<table className='w-full min-w-[34rem] table-fixed border-separate border-spacing-0.5 text-xs'>
							<caption className='sr-only'>{summary}</caption>
							<thead>
								<tr>
									<th
										scope='col'
										className='px-2 py-1.5 text-left font-semibold text-aromas_ink'>
										{rowHeader}
									</th>
									{columnLabels.map((column) => (
										<th
											key={column}
											scope='col'
											className='px-2 py-1.5 text-right font-semibold text-aromas_ink'>
											{column}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rowLabels.map((row, rowIndex) => (
									<tr key={row}>
										<th
											scope='row'
											className='whitespace-nowrap px-2 py-1.5 text-left font-medium text-aromas_ink'>
											{row}
										</th>
										{columnLabels.map(
											(column, columnIndex) => {
												const value =
													values[rowIndex]?.[
														columnIndex
													] ?? null;

												if (value === null) {
													return (
														<td
															key={column}
															className='rounded px-2 py-1.5 text-right text-aromas_ink_muted'>
															<span className='sr-only'>
																Sin datos
															</span>
															<span aria-hidden='true'>
																—
															</span>
														</td>
													);
												}

												const step = magnitudeStep(
													maxValue === 0
														? 0
														: value / maxValue
												);

												return (
													<td
														key={column}
														style={{
															backgroundColor:
																step.fill,
															color: step.onFill,
														}}
														className='rounded px-2 py-1.5 text-right font-semibold tabular-nums forced-colors:border forced-colors:border-[CanvasText]'>
														{cellFormatter(value)}
													</td>
												);
											}
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Scale legend: the ramp has no axis, so it needs one. */}
					<div className='flex items-center gap-2'>
						<span className='text-xs text-aromas_ink_muted'>
							Menos
						</span>
						<ul
							aria-hidden='true'
							className='flex items-center gap-0.5'>
							{ORDINAL_STEPS.map((step) => (
								<li
									key={step.fill}
									style={{ backgroundColor: step.fill }}
									className='h-3 w-6 rounded-sm forced-colors:border forced-colors:border-[CanvasText]'
								/>
							))}
						</ul>
						<span className='text-xs text-aromas_ink_muted'>
							{`Más (hasta ${formatValue(maxValue)})`}
						</span>
					</div>
				</>
			)}

			{footnote && (
				<p className='text-xs text-aromas_ink_muted'>{footnote}</p>
			)}
		</figure>
	);
};

export default HeatmapChart;
