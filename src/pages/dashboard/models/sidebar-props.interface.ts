import type { IDashboardItem } from './dashboard-items.interface';

export interface ISidebarProps {
	dashboardItems: IDashboardItem[];
	activePage: string;
	setActivePage: React.Dispatch<React.SetStateAction<string>>;
}
