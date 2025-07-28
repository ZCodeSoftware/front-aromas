import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { ISidebarProps } from '../models/sidebar-props.interface';

const Sidebar = ({
	dashboardItems,
	activePage,
	setActivePage,
}: ISidebarProps) => {
	const renderSidebarItems = () => {
		return dashboardItems.map((item) => {
			if (item.subItems) {
				return (
					<Accordion
						type='single'
						collapsible
						key={item.id}
						className='w-full'>
						<AccordionItem value={item.id} className='border-b-0'>
							<AccordionTrigger className='py-2 px-3 hover:bg-muted/50 rounded-md'>
								{item.name}
							</AccordionTrigger>
							<AccordionContent className='pl-4 pt-2'>
								<div className='space-y-1'>
									{item.subItems.map((subItem) => (
										<Button
											key={subItem.id}
											variant={
												activePage === subItem.id
													? 'secondary'
													: 'ghost'
											}
											className='w-full justify-start'
											onClick={() =>
												setActivePage(subItem.id)
											}>
											{subItem.name}
										</Button>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				);
			}
			return (
				<Button
					key={item.id}
					variant={activePage === item.id ? 'default' : 'ghost'}
					className='w-full justify-start'
					onClick={() => setActivePage(item.id)}>
					{item.name}
				</Button>
			);
		});
	};

	return (
		<nav className='flex-grow space-y-1 p-2'>{renderSidebarItems()}</nav>
	);
};

export default Sidebar;
