import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ScopeBadge, { type ScopeKind } from './ScopeBadge';

interface MetricCardProps {
	title: string;
	description?: string;
	scope?: ScopeKind;
	/** Controls that belong to this card, e.g. the chart's granularity. */
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}

/**
 * The surface every metric sits on.
 *
 * Deliberately not the shared shadcn `Card`: that component paints itself with
 * `bg-card`, a token this project never defines, so it renders transparent —
 * and this view sits on a purple-to-peach gradient, where transparent means the
 * text contrast changes across the width of the card and nothing can be
 * guaranteed. An opaque white surface is what makes every ratio in here
 * measurable, and it is what the charts' palette was validated against.
 *
 * The title is a real `h3`, so the five views keep a walkable heading outline
 * under the section's `h2`.
 */
const MetricCard = ({
	title,
	description,
	scope,
	action,
	children,
	className,
}: MetricCardProps) => {
	const titleId = useId();

	return (
		<section
			aria-labelledby={titleId}
			className={cn(
				'flex flex-col gap-4 rounded-xl border border-aromas_gray_line bg-white p-4 shadow-sm sm:p-5',
				className
			)}>
			<div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-2'>
				<div className='flex flex-col gap-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<h3
							id={titleId}
							className='text-base font-semibold text-aromas_ink'>
							{title}
						</h3>
						{scope && <ScopeBadge scope={scope} />}
					</div>
					{description && (
						<p className='max-w-prose text-xs text-aromas_ink_muted'>
							{description}
						</p>
					)}
				</div>
				{action}
			</div>
			{children}
		</section>
	);
};

export default MetricCard;
