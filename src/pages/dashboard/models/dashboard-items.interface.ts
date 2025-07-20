export interface IDashboardItem {
  id: string
  name: string
  component?: React.ReactNode
  subItems?: DashboardSubItem[]
}

interface DashboardSubItem {
  id: string
  name: string
  component: React.ReactNode
}
