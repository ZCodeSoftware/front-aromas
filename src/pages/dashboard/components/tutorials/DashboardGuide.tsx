import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ITourDefinition } from '../../tutorials/models/dashboard-tour.interface';
import TutorialsDialog from './TutorialsDialog';
import TourGuide from './TourGuide';

const SEEN_STORAGE_KEY = 'aromas:dashboard-tutorials-seen';

interface IDashboardGuideProps {
	/** Id of the dashboard page in view, so the guide opens on its chapter. */
	activePage: string;
	/** Handed to the tour player, which walks the admin across screens. */
	setActivePage: (page: string) => void;
}

const DashboardGuide = ({
	activePage,
	setActivePage,
}: IDashboardGuideProps) => {
	const [open, setOpen] = useState(false);
	const [activeTour, setActiveTour] = useState<ITourDefinition | null>(null);
	// A dot marks the button until the guide has been opened once, so a new admin
	// notices it exists without a modal getting in the way of their first task.
	const [seen, setSeen] = useState(
		() => localStorage.getItem(SEEN_STORAGE_KEY) === 'true'
	);

	const handleOpen = () => {
		setOpen(true);
		if (!seen) {
			localStorage.setItem(SEEN_STORAGE_KEY, 'true');
			setSeen(true);
		}
	};

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						onClick={handleOpen}
						data-tutorial='dashboard-help'
						aria-label='Abrir la guía de uso del panel'
						className='relative text-aromas_fucsia hover:bg-aromas_pink/30'>
						<HelpCircle className='h-5 w-5' />
						{!seen && (
							<span className='absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-aromas_fucsia' />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent className='bg-white text-aromas_gray_text shadow-md'>
					Guía de uso: recorridos paso a paso
				</TooltipContent>
			</Tooltip>

			<TutorialsDialog
				open={open}
				setOpen={setOpen}
				activePage={activePage}
				onStartTour={setActiveTour}
			/>

			{activeTour && (
				<TourGuide
					key={activeTour.id}
					tour={activeTour}
					setActivePage={setActivePage}
					onExit={() => setActiveTour(null)}
				/>
			)}
		</>
	);
};

export default DashboardGuide;
