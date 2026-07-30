import type { IDashboardItem } from './dashboard-items.interface';

export interface ISidebarProps {
	dashboardItems: IDashboardItem[];
	activePage: string;
	setActivePage: (id: string) => void;
}
