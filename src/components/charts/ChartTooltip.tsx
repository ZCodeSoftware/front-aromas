import { CHART } from './chart-tokens';

export interface ITooltipRow {
	/** Series colour. Rendered as a short line key beside the text. */
	color?: string;
	label: string;
	value: string;
}

interface ChartTooltipProps {
	left: number;
	top: number;
	heading: string;
	rows: ITooltipRow[];
	note?: string;
}

export const TOOLTIP_WIDTH = 172;

/**
 * Hidden from assistive technology on purpose: the same content is spoken by
 * the plot's live region and printed in the figure's table twin, so announcing
 * a floating box a third time only adds noise. The tooltip is the sighted
 * reader's convenience, never the only route to a value.
 *
 * Values lead and labels follow — the legend's hierarchy inverted, because a
 * reader who has already found the series wants the number.
 */
const ChartTooltip = ({
	left,
	top,
	heading,
	rows,
	note,
}: ChartTooltipProps) => (
	<div
		aria-hidden='true'
		style={{
			left,
			top,
			width: TOOLTIP_WIDTH,
			backgroundColor: CHART.surface,
			borderColor: CHART.grid,
		}}
		className='pointer-events-none absolute z-10 rounded-lg border p-2.5 shadow-md'>
		<p className='text-[11px] leading-tight text-aromas_ink_muted'>
			{heading}
		</p>
		<ul className='mt-1 flex flex-col gap-1'>
			{rows.map((row) => (
				<li key={row.label} className='flex items-baseline gap-1.5'>
					{row.color && (
						<span
							aria-hidden='true'
							style={{ backgroundColor: row.color }}
							className='mb-[3px] h-0.5 w-2.5 shrink-0 self-center rounded-full'
						/>
					)}
					<span className='text-sm font-semibold leading-tight text-aromas_ink'>
						{row.value}
					</span>
					<span className='text-[11px] leading-tight text-aromas_ink_muted'>
						{row.label}
					</span>
				</li>
			))}
		</ul>
		{note && (
			<p className='mt-1 text-[11px] leading-tight text-aromas_ink_muted'>
				{note}
			</p>
		)}
	</div>
);

export default ChartTooltip;
