import React, { useState } from 'react';
import type { IDashboardItem } from './models/dashboard-items.interface';
import DashboardHome from './components/dashboardHome/DashboardHome';
import DashboardProducts from './components/dashboardProducts/productssList/DashboardProductsList';
import DashboardCreateProduct from './components/dashboardProducts/createProduct/DashboardCreateProduct';
import Sidebar from './components/Sidebar';
import DashboardCatalogsList from './components/dashboardCatalogs/catalogsList/DashboardCatalogList';
import DashboardCreateCatalogs from './components/dashboardCatalogs/createCatalogs/DashboardCreate';
import RolesList from './components/dashboardCatalogs/catalogsList/RolesList';
import UsersList from './components/dashboardUsers/usersList/UsersList';
import OrdersList from './components/dashboardOrders/ordersList/OrdersList';
import RegisterSale from './components/dashboardPos/registerSale/RegisterSale';
import SalesList from './components/dashboardPos/salesList/SalesList';
import ReviewsList from './components/dashboardReviews/reviewsList/ReviewsList';
import Navbar from '@/layout/components/navbar/Navbar';
import DashboardGuide from './components/tutorials/DashboardGuide';

const Dashboard: React.FC = () => {
	const dashboardItems: IDashboardItem[] = [
		{
			id: 'home',
			name: 'Inicio',
			component: <DashboardHome />,
		},
		{
			id: 'products',
			name: 'Productos',
			subItems: [
				{
					id: 'product-list',
					name: 'Lista de Productos',
					component: <DashboardProducts />,
				},
				{
					id: 'create-product',
					name: 'Crear Producto',
					component: <DashboardCreateProduct />,
				},
			],
		},
		{
			id: 'catalogs',
			name: 'Catálogos',
			subItems: [
				{
					id: 'catalog-list',
					name: 'Lista de Catálogos',
					component: <DashboardCatalogsList />,
				},
				{
					id: 'create-catalog',
					name: 'Crear Catálogo',
					component: <DashboardCreateCatalogs />,
				},
			],
		},
		{
			id: 'users',
			name: 'Usuarios',
			subItems: [
				{
					id: 'user-list',
					name: 'Lista de Usuarios',
					component: <UsersList />,
				},
				{
					id: 'role-list',
					name: 'Roles',
					component: <RolesList />,
				},
			],
		},
		{
			id: 'orders',
			name: 'Pedidos',
			subItems: [
				{
					id: 'order-list',
					name: 'Lista de Pedidos',
					component: <OrdersList />,
				},
			],
		},
		{
			id: 'pos',
			name: 'Punto de Venta',
			subItems: [
				{
					id: 'pos-register-sale',
					name: 'Registrar Venta',
					component: <RegisterSale />,
				},
				{
					id: 'pos-sales-list',
					name: 'Ventas',
					component: <SalesList />,
				},
			],
		},
		{
			id: 'reviews',
			name: 'Reseñas',
			subItems: [
				{
					id: 'review-list',
					name: 'Moderación de Reseñas',
					component: <ReviewsList />,
				},
			],
		},
	];

	const [activePage, setActivePage] = useState<string>(dashboardItems[0].id);

	const findActiveComponent = (items: IDashboardItem[]): React.ReactNode => {
		for (const item of items) {
			if (item.id === activePage) {
				return item.component;
			}

			if (item.subItems) {
				const subItemComponent = item.subItems.find(
					(subItem) => subItem.id === activePage
				)?.component;
				if (subItemComponent) {
					return subItemComponent;
				}
			}
		}
		return null;
	};

	const ActiveComponent = findActiveComponent(dashboardItems);

	return (
		<>
			<Navbar />
			<div className='flex w-full h-[93.5vh]'>
				{/*
				 * `aside`, so the sidebar is a complementary landmark rather
				 * than page content sitting outside every landmark — which is
				 * what left the dashboard heading unreachable by landmark
				 * navigation.
				 */}
				<aside
					aria-label='Secciones del dashboard'
					data-tutorial='dashboard-sidebar'
					className='w-64 bg-aromas_nav_bg border-r p-4 flex flex-col overflow-y-auto'>
					<div className='mb-10 flex items-center justify-center gap-1'>
						<h1 className='text-2xl text-aromas_gray_text font-bold'>
							Dashboard
						</h1>
						<DashboardGuide
							activePage={activePage}
							setActivePage={setActivePage}
						/>
					</div>
					<Sidebar
						dashboardItems={dashboardItems}
						activePage={activePage}
						setActivePage={setActivePage}
					/>
					<div className='mt-auto text-center'>
						<p className='text-sm text-gray-500'>
							© 2025 Aromas y Armonía. All rights reserved.
						</p>
					</div>
				</aside>
				{/*
				 * A `main` landmark, not a div: this is the one region a
				 * screen-reader user wants to jump straight to, and without it
				 * the only way into the content is tabbing past the whole
				 * sidebar tree on every page change.
				 */}
				<main
					data-tutorial='dashboard-content'
					className={`flex-grow bg-white overflow-y-auto p-4 ${
						activePage === 'home'
							? 'bg-gradient-to-br from-aromas_bg_gradient_1 to-aromas_bg_gradient_2'
							: ''
					}`}>
					<div>{ActiveComponent}</div>
				</main>
			</div>
		</>
	);
};

export default Dashboard;
