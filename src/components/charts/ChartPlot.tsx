import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FOCUS_RING } from '@/lib/a11y';
import { useContainerWidth } from './chart-hooks';
import type { IChartCursor } from './chart-hooks';

interface ChartPlotProps {
	/**
	 * What a screen reader hears in place of the drawing: the headline or the
	 * shape of the data, not a list of values. The figure's table twin carries
	 * the values, so this stays a sentence.
	 */
	label: string;
	/** Height of the drawing, x-axis band included. */
	height: number;
	/**
	 * Receives the measured container width so the chart can be drawn at 1:1
	 * CSS pixels. Charts are never scaled by a viewBox, because scaling shrinks
	 * the label text with the plot and breaks reflow on a narrow card.
	 */
	children: (width: number) => ReactNode;
	/** Keyboard/pointer cursor shared with the marks. */
	cursor?: IChartCursor;
	/** HTML overlay, positioned by the chart. */
	tooltip?: ReactNode;
	className?: string;
}

/**
 * The interactive shell around a drawing.
 *
 * One tab stop per chart, not one per mark: the plot is a labelled group whose
 * inner SVG is hidden from assistive technology (shape-by-shape crawling of a
 * bar chart is noise), the arrow keys walk the data inside it, and a polite
 * live region speaks whatever the cursor lands on — so keyboard focus surfaces
 * exactly what a pointer hover does.
 */
const ChartPlot = ({
	label,
	height,
	children,
	cursor,
	tooltip,
	className,
}: ChartPlotProps) => {
	const [ref, width] = useContainerWidth<HTMLDivElement>();
	const hintId = useId();
	const isInteractive = Boolean(cursor);

	return (
		<>
			<div
				ref={ref}
				role='group'
				aria-label={label}
				aria-describedby={isInteractive ? hintId : undefined}
				className={cn(
					'relative w-full rounded-md',
					isInteractive && FOCUS_RING,
					className
				)}
				{...(cursor?.keyboardProps ?? {})}
				onPointerLeave={
					cursor ? () => cursor.setIndex(null) : undefined
				}>
				{width > 0 ? (
					children(width)
				) : (
					<div style={{ height }} aria-hidden='true' />
				)}
				{tooltip}
			</div>

			{isInteractive && (
				<>
					<p id={hintId} className='sr-only'>
						Gráfico interactivo. Usá las flechas para recorrer los
						datos, Inicio y Fin para ir a los extremos, y Escape para
						salir. Todos los valores están también en la tabla de
						datos.
					</p>
					<p role='status' aria-live='polite' className='sr-only'>
						{cursor?.announcement}
					</p>
				</>
			)}
		</>
	);
};

export default ChartPlot;
