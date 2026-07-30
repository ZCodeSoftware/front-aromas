import { AlertTriangle, Lightbulb, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type {
	ITutorialControl,
	ITutorialControlKind,
} from '../../tutorials/models/dashboard-tutorial.interface';

const KIND_LABELS: Record<ITutorialControlKind, string> = {
	primary: 'Acción principal',
	secondary: 'Apoyo',
	navigation: 'Navegación',
	toggle: 'Interruptor',
	destructive: 'Con cuidado',
};

const KIND_STYLES: Record<ITutorialControlKind, string> = {
	primary: 'bg-aromas_pink text-aromas_gray_text',
	secondary: 'bg-aromas_icons_bg text-aromas_gray_text',
	navigation: 'bg-[#E0E7FF] text-indigo-700',
	toggle: 'bg-[#DBEAFE] text-blue-700',
	destructive: 'bg-[#FEE2E2] text-red-700',
};

interface ITutorialControlCardProps {
	control: ITutorialControl;
	/** Set only in search results, where a control is shown out of its chapter. */
	sectionTitle?: string;
}

const TutorialControlCard = ({
	control,
	sectionTitle,
}: ITutorialControlCardProps) => (
	<article className='rounded-xl border border-aromas_gray_line bg-white p-4'>
		<header className='flex flex-wrap items-start justify-between gap-2'>
			<h4 className='font-semibold text-aromas_gray_text'>
				{control.label}
			</h4>
			<Badge className={KIND_STYLES[control.kind]}>
				{KIND_LABELS[control.kind]}
			</Badge>
		</header>

		{sectionTitle && (
			<p className='mt-1 text-xs text-aromas_fucsia'>{sectionTitle}</p>
		)}

		<p className='mt-2 flex items-start gap-1.5 text-xs text-aromas_gray_text/70'>
			<MapPin className='mt-0.5 h-3.5 w-3.5 shrink-0' />
			{control.location}
		</p>

		<p className='mt-3 text-sm text-aromas_gray_text'>{control.what}</p>

		<ol className='mt-3 space-y-1.5'>
			{control.steps.map((step, index) => (
				<li
					key={step}
					className='flex items-start gap-2 text-sm text-aromas_gray_text'>
					<span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-aromas_nav_bg text-xs font-semibold text-aromas_fucsia'>
						{index + 1}
					</span>
					{step}
				</li>
			))}
		</ol>

		{control.tip && (
			<p className='mt-3 flex items-start gap-2 rounded-lg bg-aromas_nav_bg p-2.5 text-sm text-aromas_gray_text'>
				<Lightbulb className='mt-0.5 h-4 w-4 shrink-0 text-aromas_fucsia' />
				{control.tip}
			</p>
		)}

		{control.warning && (
			<p className='mt-2 flex items-start gap-2 rounded-lg bg-[#FEE2E2] p-2.5 text-sm text-red-700'>
				<AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
				{control.warning}
			</p>
		)}
	</article>
);

export default TutorialControlCard;
