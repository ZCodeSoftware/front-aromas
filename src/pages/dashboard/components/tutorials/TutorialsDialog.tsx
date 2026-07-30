import { useEffect, useMemo, useState } from 'react';
import { Clock, Footprints, PlayCircle, Search } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	dashboardTutorials,
	getTutorialSectionId,
} from '../../tutorials/dashboard-tutorials';
import { dashboardTours } from '../../tutorials/dashboard-tours';
import type { ITourDefinition } from '../../tutorials/models/dashboard-tour.interface';
import type {
	ITutorialControl,
	ITutorialSection,
} from '../../tutorials/models/dashboard-tutorial.interface';
import TutorialControlCard from './TutorialControlCard';

type IGuideTab = 'tours' | 'reference';

interface ITutorialsDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	/** Id of the dashboard page in view, used to pick the opening chapter. */
	activePage: string;
	onStartTour: (tour: ITourDefinition) => void;
}

/** The combining accents that NFD normalisation splits off from each letter. */
const DIACRITICS = /\p{Diacritic}/gu;

/** Matching ignores accents so "navegacion" also finds "navegación". */
const normalize = (value: string) =>
	value.toLowerCase().normalize('NFD').replace(DIACRITICS, '');

const controlMatches = (control: ITutorialControl, query: string) =>
	normalize(
		[
			control.label,
			control.location,
			control.what,
			control.tip ?? '',
			control.warning ?? '',
			...control.steps,
		].join(' '),
	).includes(query);

const countControls = (section: ITutorialSection) =>
	section.groups.reduce((total, group) => total + group.controls.length, 0);

const coversPage = (tour: ITourDefinition, activePage: string) =>
	tour.steps.some((step) => step.page === activePage);

const TutorialsDialog = ({
	open,
	setOpen,
	activePage,
	onStartTour,
}: ITutorialsDialogProps) => {
	const [tab, setTab] = useState<IGuideTab>('tours');
	const [sectionId, setSectionId] = useState(() =>
		getTutorialSectionId(activePage),
	);
	const [query, setQuery] = useState('');

	// Every opening starts on the list of tours, with the reference already
	// pointing at the page behind the dialog and a clean search box.
	useEffect(() => {
		if (open) {
			setTab('tours');
			setSectionId(getTutorialSectionId(activePage));
			setQuery('');
		}
	}, [open, activePage]);

	const activeSection =
		dashboardTutorials.find((section) => section.id === sectionId) ??
		dashboardTutorials[0];

	const trimmedQuery = normalize(query.trim());

	const searchResults = useMemo(() => {
		if (!trimmedQuery) return [];
		return dashboardTutorials.flatMap((section) =>
			section.groups.flatMap((group) =>
				group.controls
					.filter((control) => controlMatches(control, trimmedQuery))
					.map((control) => ({
						control,
						sectionTitle: `${section.title} › ${group.title}`,
					})),
			),
		);
	}, [trimmedQuery]);

	// Whatever documents the current screen goes first: that is almost always
	// what the admin is looking for when they press the help button.
	const sortedTours = useMemo(
		() =>
			[...dashboardTours].sort((first, second) => {
				const firstScore = coversPage(first, activePage) ? 0 : 1;
				const secondScore = coversPage(second, activePage) ? 0 : 1;
				return firstScore - secondScore;
			}),
		[activePage],
	);

	const handleStartTour = (tour: ITourDefinition) => {
		setOpen(false);
		onStartTour(tour);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl'>
				<DialogHeader className='border-b p-4 pb-4'>
					<DialogTitle className='text-xl text-aromas_gray_text'>
						Guía de uso del panel
					</DialogTitle>
					<DialogDescription>
						Recorridos que te llevan paso a paso por cada pantalla,
						y una referencia de todos los botones para consultar
						suelto.
					</DialogDescription>
					<div className='mt-3 flex items-center gap-2'>
						<Button
							size='sm'
							className={`border border-aromas_fucsia text-aromas_fucsia ${
								tab === 'tours'
									? 'bg-aromas_pink text-aromas_gray_text'
									: ''
							}`}
							onClick={() => setTab('tours')}>
							<Footprints className='mr-1 h-4 w-4' />
							Recorridos guiados
						</Button>
						<Button
							size='sm'
							className={`border border-aromas_fucsia text-aromas_fucsia ${
								tab === 'reference'
									? 'bg-aromas_pink text-aromas_gray_text'
									: ''
							}`}
							onClick={() => setTab('reference')}>
							<Search className='mr-1 h-4 w-4' />
							Referencia de botones
						</Button>
					</div>
				</DialogHeader>

				{tab === 'tours' ? (
					<div className='flex-1 overflow-y-auto p-4'>
						<p className='mb-3 text-sm text-aromas_gray_text/70'>
							Cada recorrido resalta el botón del que habla sobre
							la pantalla real y espera a que avances. Podés usar
							las flechas ← y → del teclado, y salir con Escape.
						</p>
						<p className='mb-4 rounded-lg bg-aromas_nav_bg p-2.5 text-sm text-aromas_gray_text'>
							Los recorridos cambian de pantalla por su cuenta,
							así que guardá lo que estés editando antes de
							empezar.
						</p>

						<div className='grid gap-3 sm:grid-cols-2'>
							{sortedTours.map((tour) => (
								<article
									key={tour.id}
									className='flex flex-col rounded-xl border border-aromas_gray_line p-4'>
									<div className='flex items-start justify-between gap-2'>
										<h3 className='font-semibold text-aromas_gray_text'>
											{tour.title}
										</h3>
										{coversPage(tour, activePage) && (
											<Badge className='shrink-0 bg-aromas_pink text-aromas_gray_text'>
												Para esta pantalla
											</Badge>
										)}
									</div>

									<p className='mt-1.5 flex-1 text-sm text-aromas_gray_text/80'>
										{tour.description}
									</p>

									<div className='mt-3 flex items-center gap-3 text-xs text-aromas_gray_text/60'>
										<span className='flex items-center gap-1'>
											<Footprints className='h-3.5 w-3.5' />
											{`${tour.steps.length} pasos`}
										</span>
										<span className='flex items-center gap-1'>
											<Clock className='h-3.5 w-3.5' />
											{`~${tour.minutes} min`}
										</span>
									</div>

									<Button
										size='sm'
										className='mt-3 w-full bg-aromas_pink text-aromas_gray_text'
										onClick={() => handleStartTour(tour)}>
										<PlayCircle className='mr-1 h-4 w-4' />
										Empezar
									</Button>
								</article>
							))}
						</div>
					</div>
				) : (
					<>
						<div className='relative border-b p-4'>
							<Search className='absolute top-1/2 left-7 h-4 w-4 -translate-y-1/2 text-aromas_gray_text/50' />
							<Input
								value={query}
								onChange={(event) =>
									setQuery(event.target.value)
								}
								placeholder='Buscar un botón: reembolsar, mostrar inactivos, recortar…'
								className='pl-9'
							/>
						</div>

						{trimmedQuery ? (
							<div className='flex-1 space-y-3 overflow-y-auto p-4'>
								<p className='text-sm text-aromas_gray_text/70'>
									{searchResults.length === 0
										? 'No encontramos ningún botón con ese nombre.'
										: `${searchResults.length} resultado(s) para "${query.trim()}".`}
								</p>
								{searchResults.map((result) => (
									<TutorialControlCard
										key={`${result.sectionTitle}-${result.control.label}`}
										control={result.control}
										sectionTitle={result.sectionTitle}
									/>
								))}
							</div>
						) : (
							<div className='flex min-h-0 flex-1 flex-col md:flex-row'>
								<nav className='shrink-0 space-y-1 overflow-y-auto border-b bg-aromas_nav_bg p-2 md:w-60 md:border-b-0 md:border-r'>
									{dashboardTutorials.map((section) => (
										<Button
											key={section.id}
											variant='ghost'
											onClick={() =>
												setSectionId(section.id)
											}
											className={`h-auto w-full justify-start gap-2 py-2 text-left whitespace-normal ${
												section.id === activeSection.id
													? 'bg-aromas_pink text-aromas_gray_text'
													: ''
											}`}>
											<span className='flex-1'>
												{section.title}
											</span>
											<span className='text-xs text-aromas_gray_text/60'>
												{countControls(section)}
											</span>
										</Button>
									))}
								</nav>

								<div className='flex-1 overflow-y-auto p-4'>
									<h3 className='text-lg font-bold text-aromas_gray_text'>
										{activeSection.title}
									</h3>
									<p className='mt-1 text-sm text-aromas_gray_text/70'>
										{activeSection.summary}
									</p>

									{activeSection.groups.map((group) => (
										<section
											key={group.title}
											className='mt-5'>
											<h4 className='mb-2 text-xs font-semibold tracking-wide text-aromas_fucsia uppercase'>
												{group.title}
											</h4>
											<div className='space-y-3'>
												{group.controls.map(
													(control) => (
														<TutorialControlCard
															key={control.label}
															control={control}
														/>
													),
												)}
											</div>
										</section>
									))}
								</div>
							</div>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default TutorialsDialog;
