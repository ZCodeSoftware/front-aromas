import { useId } from 'react';
import { AlertTriangle, CheckCircle2, CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS, type StatusRole } from './chart-tokens';

interface MeterProps {
	label: string;
	value: number;
	max: number;
	/** Rendered as the readable value, e.g. "12 de 340 productos". */
	valueText: string;
	/** Only ever set when the colour genuinely means a state. */
	status: StatusRole;
	hint?: string;
}

/**
 * A single ratio against a limit — a meter, not a two-slice pie.
 *
 * `role="meter"` gives assistive technology the number, the bounds and a
 * readable `aria-valuetext`, so the fill is never the only carrier. The status
 * colour always arrives with an icon and a word: two of the four status steps
 * sit under 3:1 on a light surface by design, and that pairing is the
 * mitigation. The unfilled track is a lighter wash of the same fill, so the
 * state reads across the whole bar rather than only where it is painted.
 */
const STATUS_META: Record<
	StatusRole,
	{ icon: typeof CheckCircle2; word: string; textClass: string }
> = {
	good: { icon: CheckCircle2, word: 'Correcto', textClass: 'text-aromas_success' },
	warning: {
		icon: AlertTriangle,
		word: 'Atención',
		textClass: 'text-aromas_warning_ink',
	},
	serious: {
		icon: AlertTriangle,
		word: 'Revisar',
		textClass: 'text-aromas_warning_ink',
	},
	critical: {
		icon: CircleAlert,
		word: 'Crítico',
		textClass: 'text-aromas_critical_ink',
	},
};

const Meter = ({ label, value, max, valueText, status, hint }: MeterProps) => {
	const labelId = useId();
	const safeMax = max > 0 ? max : 1;
	const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));
	const meta = STATUS_META[status];
	const Icon = meta.icon;

	return (
		<div className='viz-root flex flex-col gap-1.5'>
			<div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5'>
				<span
					id={labelId}
					className='text-sm font-medium text-aromas_ink'>
					{label}
				</span>
				<span
					className={cn(
						'inline-flex items-center gap-1 text-xs font-semibold',
						meta.textClass
					)}>
					<Icon aria-hidden='true' className='size-3.5' />
					{meta.word}
				</span>
			</div>

			<div
				role='meter'
				aria-labelledby={labelId}
				aria-valuenow={value}
				aria-valuemin={0}
				aria-valuemax={safeMax}
				aria-valuetext={`${valueText}. ${meta.word}`}
				className='relative h-2.5 w-full overflow-hidden rounded-full border border-transparent forced-colors:border-[CanvasText]'>
				{/* Track: the same hue washed back. Fill: the full step. */}
				<span
					aria-hidden='true'
					style={{ backgroundColor: STATUS[status] }}
					className='absolute inset-0 opacity-20'
				/>
				<span
					aria-hidden='true'
					style={{
						width: `${percent}%`,
						backgroundColor: STATUS[status],
					}}
					className='absolute inset-y-0 left-0 rounded-full'
				/>
			</div>

			<p className='text-xs text-aromas_ink_muted'>
				<span className='font-semibold tabular-nums text-aromas_ink'>
					{valueText}
				</span>
				{hint ? ` · ${hint}` : ''}
			</p>
		</div>
	);
};

export default Meter;
