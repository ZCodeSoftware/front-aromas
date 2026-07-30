import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts';
import ScopeBadge, { type ScopeKind } from './components/ScopeBadge';
import { formatPercent } from './utils/format';

export interface IStatDelta {
	/** Null when the previous period had nothing to compare against. */
	percent: number | null;
	/** Names what it is compared with, e.g. "vs. período anterior". */
	comparisonLabel: string;
}

interface StatTileProps {
	label: string;
	value: string;
	hint?: string;
	scope?: ScopeKind;
	delta?: IStatDelta;
	/** Same measure across the period, for the sparkline. */
	trend?: number[];
	/** The one headline figure of a view. At most one per view. */
	isHero?: boolean;
}

/**
 * The right form for a single number: a tile, never a one-bar bar chart.
 *
 * Rendered as a `dt`/`dd` pair so a KPI row is a description list rather than a
 * pile of divs — a screen reader then reads "Ingresos, $1.234" instead of two
 * unrelated strings. Values use proportional figures: `tabular-nums` gives every
 * digit the width of a zero, which makes a large standalone number look loose.
 */
const DeltaBadge = ({ delta }: { delta: IStatDelta }) => {
	if (delta.percent === null) {
		return (
			<span className='inline-flex items-center gap-1 text-xs text-aromas_ink_muted'>
				<ArrowRight aria-hidden='true' className='size-3.5' />
				{`Sin base de comparación ${delta.comparisonLabel}`}
			</span>
		);
	}

	const isUp = delta.percent > 0;
	const isFlat = Math.abs(delta.percent) < 0.05;
	const Icon = isFlat ? ArrowRight : isUp ? ArrowUpRight : ArrowDownRight;

	/*
	 * The arrow and the sign carry the direction; the colour only reinforces
	 * it. Every measure on these tiles is one where up is good, so a rise is
	 * the success ink and a fall is the critical ink — and neither is the only
	 * cue, which is the point.
	 */
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 text-xs font-semibold',
				isFlat
					? 'text-aromas_ink_muted'
					: isUp
						? 'text-aromas_success'
						: 'text-aromas_critical_ink'
			)}>
			<Icon aria-hidden='true' className='size-3.5' />
			{isFlat
				? 'Sin cambios'
				: `${isUp ? '+' : '−'}${formatPercent(Math.abs(delta.percent))}`}
			<span className='font-normal text-aromas_ink_muted'>
				{delta.comparisonLabel}
			</span>
		</span>
	);
};

const StatTile = ({
	label,
	value,
	hint,
	scope,
	delta,
	trend,
	isHero = false,
}: StatTileProps): ReactNode => (
	<div
		className={cn(
			'viz-root flex flex-col gap-1 rounded-xl border border-aromas_gray_line bg-white p-4 shadow-sm',
			isHero && 'sm:col-span-2 lg:col-span-3 xl:col-span-5'
		)}>
		<dt className='flex flex-wrap items-center gap-1.5 text-sm text-aromas_ink_muted'>
			{label}
			{scope && <ScopeBadge scope={scope} />}
		</dt>
		<dd className='m-0 flex flex-col gap-1.5'>
			{/*
			 * The hero has room to sit its sparkline beside the figure; the
			 * narrower tiles do not, and letting it wrap put the delta line at
			 * a different height in every tile of the row. Its own line keeps
			 * the row aligned whatever the figure's width.
			 */}
			<div
				className={cn(
					isHero
						? 'flex flex-wrap items-end justify-between gap-2'
						: 'flex flex-col gap-1'
				)}>
				<span
					className={cn(
						'font-semibold leading-tight text-aromas_ink',
						isHero ? 'text-4xl sm:text-5xl' : 'text-2xl'
					)}>
					{value}
				</span>
				{trend && trend.length > 1 && (
					<Sparkline
						values={trend}
						width={isHero ? 140 : 92}
						height={isHero ? 40 : 24}
					/>
				)}
			</div>
			{delta && <DeltaBadge delta={delta} />}
			{hint && (
				<span className='text-xs text-aromas_ink_muted'>{hint}</span>
			)}
		</dd>
	</div>
);

export default StatTile;
