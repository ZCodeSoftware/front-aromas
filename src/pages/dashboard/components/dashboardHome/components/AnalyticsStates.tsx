import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FOCUS_RING } from '@/lib/a11y';

/**
 * `animate-pulse` is dropped under `prefers-reduced-motion`: a grid of a dozen
 * blocks breathing in unison is exactly the kind of large-area movement that
 * setting exists to stop. The shape still communicates "loading".
 */
const SkeletonBlock = ({ className }: { className?: string }) => (
	<div
		aria-hidden='true'
		className={cn(
			'rounded-xl bg-aromas_gray_text/10 animate-pulse motion-reduce:animate-none',
			className
		)}
	/>
);

/**
 * The busy state.
 *
 * `role="status"` with the label inside it means the wait is announced once,
 * politely, instead of leaving a screen-reader user on a silent screen; the
 * placeholder blocks themselves are hidden, since "rectangle, rectangle,
 * rectangle" is not information.
 */
export const AnalyticsLoading = ({
	tiles = 6,
	panels = 2,
	label = 'Cargando métricas…',
}: {
	tiles?: number;
	panels?: number;
	label?: string;
}) => (
	<div role='status' aria-busy='true' className='flex flex-col gap-4'>
		<span className='sr-only'>{label}</span>
		<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
			{Array.from({ length: tiles }).map((_, index) => (
				<SkeletonBlock key={index} className='h-24' />
			))}
		</div>
		{Array.from({ length: panels }).map((_, index) => (
			<SkeletonBlock key={index} className='h-64' />
		))}
	</div>
);

/**
 * The failure state, as a live alert with a way out.
 *
 * A toast was the wrong channel for this: it disappears after two seconds,
 * which is both a WCAG 2.2.1 timing problem and useless to anyone who was
 * looking elsewhere. An alert that stays, explains, and offers the retry is
 * reachable by keyboard and announced immediately.
 */
export const AnalyticsError = ({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) => (
	<div
		role='alert'
		className='flex flex-col items-start gap-3 rounded-xl border border-aromas_critical_ink/30 bg-white p-5 shadow-sm'>
		<p className='flex items-start gap-2 text-sm font-medium text-aromas_critical_ink'>
			<AlertCircle aria-hidden='true' className='mt-0.5 size-4 shrink-0' />
			{message}
		</p>
		<button
			type='button'
			onClick={onRetry}
			className={cn(
				'inline-flex min-h-[36px] items-center gap-2 rounded-md border border-aromas_fucsia_ink px-3 py-1.5 text-sm font-medium text-aromas_fucsia_ink hover:bg-aromas_fucsia_ink/10',
				FOCUS_RING
			)}>
			<RefreshCw aria-hidden='true' className='size-4' />
			Reintentar
		</button>
	</div>
);

/** A `<dl>` because a KPI row is a list of label/value pairs. */
export const StatTileGroup = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<dl
		className={cn(
			'm-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
			className
		)}>
		{children}
	</dl>
);
