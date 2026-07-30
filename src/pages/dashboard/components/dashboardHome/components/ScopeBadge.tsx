import { CalendarRange, Camera, Infinity as InfinityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ScopeKind = 'range' | 'snapshot' | 'lifetime';

const SCOPES: Record<
	ScopeKind,
	{ icon: typeof CalendarRange; label: string; title: string }
> = {
	range: {
		icon: CalendarRange,
		label: 'Período',
		title: 'Corresponde al período elegido en el filtro.',
	},
	snapshot: {
		icon: Camera,
		label: 'Ahora',
		title: 'Foto del estado actual: no depende del período elegido.',
	},
	lifetime: {
		icon: InfinityIcon,
		label: 'Histórico',
		title: 'Acumulado desde el inicio: no depende del período elegido.',
	},
};

/**
 * Which window a number belongs to.
 *
 * The API mixes three scopes on the same screen — catalogue totals and
 * engagement counters ignore the date filter, cart figures are a snapshot of
 * right now, and only the sales blocks are period-scoped. Without this said out
 * loud, a reader who narrows the filter and watches "Productos" stay put
 * reasonably concludes the filter is broken.
 */
const ScopeBadge = ({
	scope,
	className,
}: {
	scope: ScopeKind;
	className?: string;
}) => {
	const meta = SCOPES[scope];
	const Icon = meta.icon;

	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center gap-1 rounded-full border border-aromas_gray_line bg-aromas_nav_bg px-2 py-0.5 text-[11px] font-medium text-aromas_ink_muted',
				className
			)}>
			<Icon aria-hidden='true' className='size-3' />
			{meta.label}
			<span className='sr-only'>{`. ${meta.title}`}</span>
		</span>
	);
};

export default ScopeBadge;
