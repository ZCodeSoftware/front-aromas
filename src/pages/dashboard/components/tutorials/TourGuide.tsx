import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Eye,
	Lightbulb,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ITourDefinition } from '../../tutorials/models/dashboard-tour.interface';
import {
	getCardWidth,
	resolveCardPosition,
	sameRect,
	type IAnchorRect,
} from '../../tutorials/utils/tourGeometry';

interface ITourGuideProps {
	tour: ITourDefinition;
	/** Lets a step move the dashboard to the screen it documents. */
	setActivePage: (page: string) => void;
	onExit: () => void;
}

const findTarget = (target?: string) =>
	target
		? document.querySelector<HTMLElement>(`[data-tutorial="${target}"]`)
		: null;

const toAnchorRect = (element: HTMLElement): IAnchorRect => {
	const { top, left, width, height } = element.getBoundingClientRect();
	return { top, left, width, height };
};

const isTypingTarget = (target: EventTarget | null) => {
	if (!(target instanceof HTMLElement)) return false;
	return (
		target.isContentEditable ||
		['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
	);
};

const readViewport = () => ({
	width: window.innerWidth,
	height: window.innerHeight,
});

const TourGuide = ({ tour, setActivePage, onExit }: ITourGuideProps) => {
	const [index, setIndex] = useState(0);
	const [anchor, setAnchor] = useState<IAnchorRect | null>(null);
	const [cardHeight, setCardHeight] = useState(0);
	const [viewport, setViewport] = useState(readViewport);
	const cardRef = useRef<HTMLDivElement>(null);
	/** Each step scrolls its control into view once, not on every frame. */
	const pendingScroll = useRef(true);

	const step = tour.steps[index];
	const isFirst = index === 0;
	const isLast = index === tour.steps.length - 1;

	useEffect(() => {
		if (step.page) setActivePage(step.page);
	}, [step.page, setActivePage]);

	useEffect(() => {
		pendingScroll.current = true;
	}, [index]);

	// The highlight follows the control frame by frame: the panel scrolls, the
	// sidebar accordion animates and a step can change pages, so a one-off
	// measurement would leave the ring behind.
	useEffect(() => {
		let frame = 0;

		const measure = () => {
			const node = findTarget(step.target);

			if (node && pendingScroll.current) {
				pendingScroll.current = false;
				node.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}

			const next = node ? toAnchorRect(node) : null;
			setAnchor((prev) => (sameRect(prev, next) ? prev : next));
			setCardHeight((prev) => cardRef.current?.offsetHeight ?? prev);
			setViewport((prev) => {
				const current = readViewport();
				return prev.width === current.width &&
					prev.height === current.height
					? prev
					: current;
			});

			frame = requestAnimationFrame(measure);
		};

		frame = requestAnimationFrame(measure);
		return () => cancelAnimationFrame(frame);
	}, [step.target]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onExit();
				return;
			}

			// Several tours ask the admin to type into a field, where the arrows
			// belong to the caret and must not advance the tour.
			if (isTypingTarget(event.target)) return;

			if (event.key === 'ArrowRight') {
				event.preventDefault();
				if (isLast) {
					onExit();
				} else {
					setIndex(index + 1);
				}
			} else if (event.key === 'ArrowLeft' && !isFirst) {
				event.preventDefault();
				setIndex(index - 1);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [index, isFirst, isLast, onExit]);

	const { top, left } = resolveCardPosition(anchor, cardHeight, viewport);
	const progress = ((index + 1) / tour.steps.length) * 100;
	// The card stays hidden until the first measurement lands, so it does not
	// flash at the bottom of the screen before it knows its own height.
	const cardVisibility = cardHeight ? 'opacity-100' : 'opacity-0';

	return createPortal(
		<>
			{anchor ? (
				<div
					className='pointer-events-none fixed z-40 rounded-lg ring-4 ring-aromas_fucsia'
					style={{
						top: anchor.top - 4,
						left: anchor.left - 4,
						width: anchor.width + 8,
						height: anchor.height + 8,
						boxShadow: '0 0 0 9999px rgba(23, 23, 23, 0.55)',
					}}
				/>
			) : (
				<div className='pointer-events-none fixed inset-0 z-40 bg-black/50' />
			)}

			<div
				ref={cardRef}
				role='dialog'
				aria-label={`${tour.title}: paso ${index + 1} de ${tour.steps.length}`}
				className={`pointer-events-auto fixed z-[70] rounded-2xl border border-aromas_gray_line bg-white p-5 shadow-2xl transition-opacity ${cardVisibility}`}
				style={{ top, left, width: getCardWidth(viewport) }}>
				<div className='flex items-start justify-between gap-2'>
					<p className='text-xs font-semibold tracking-wide text-aromas_fucsia uppercase'>
						{tour.title}
					</p>
					<button
						type='button'
						onClick={onExit}
						aria-label='Salir del recorrido'
						className='text-aromas_gray_text/50 hover:text-aromas_gray_text'>
						<X className='h-4 w-4' />
					</button>
				</div>

				<div className='mt-2 flex items-center gap-2'>
					<span className='text-xs text-aromas_gray_text/60'>
						{`Paso ${index + 1} de ${tour.steps.length}`}
					</span>
					<div className='h-1.5 flex-1 overflow-hidden rounded-full bg-aromas_nav_bg'>
						<div
							className='h-full rounded-full bg-aromas_fucsia transition-all duration-300'
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				<h3 className='mt-3 font-bold text-aromas_gray_text'>
					{step.title}
				</h3>
				<p className='mt-1.5 text-sm text-aromas_gray_text'>{step.body}</p>

				{step.result && (
					<p className='mt-3 flex items-start gap-2 rounded-lg bg-[#DCFCE7] p-2.5 text-sm text-aromas_success'>
						<CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0' />
						{step.result}
					</p>
				)}

				{step.tip && (
					<p className='mt-2 flex items-start gap-2 rounded-lg bg-aromas_nav_bg p-2.5 text-sm text-aromas_gray_text'>
						<Lightbulb className='mt-0.5 h-4 w-4 shrink-0 text-aromas_fucsia' />
						{step.tip}
					</p>
				)}

				{step.warning && (
					<p className='mt-2 flex items-start gap-2 rounded-lg bg-[#FEE2E2] p-2.5 text-sm text-red-700'>
						<AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
						{step.warning}
					</p>
				)}

				{step.target && !anchor && (
					<p className='mt-2 flex items-start gap-2 text-xs text-aromas_gray_text/60'>
						<Eye className='mt-0.5 h-3.5 w-3.5 shrink-0' />
						Este control todavía no está en pantalla: aparece cuando
						hacés lo que describe el paso.
					</p>
				)}

				<div className='mt-4 flex items-center justify-between gap-2'>
					<Button
						variant='ghost'
						size='sm'
						disabled={isFirst}
						onClick={() => setIndex(index - 1)}>
						<ArrowLeft className='mr-1 h-4 w-4' />
						Anterior
					</Button>
					<Button
						size='sm'
						className='bg-aromas_pink text-aromas_gray_text'
						onClick={() => {
							if (isLast) {
								onExit();
							} else {
								setIndex(index + 1);
							}
						}}>
						{isLast ? 'Terminar' : 'Siguiente'}
						{!isLast && <ArrowRight className='ml-1 h-4 w-4' />}
					</Button>
				</div>
			</div>
		</>,
		document.body
	);
};

export default TourGuide;
