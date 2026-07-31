import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';
import { DASHBOARD_ROUTE, HOME_ROUTE } from './config/routes';
import { Dashboard } from './pages/dashboard';
import AdminRoute from './components/AdminRoute';
import SessionExpiredWatcher from './components/SessionExpiredWatcher';

function App() {
	return (
		<Router>
			<SessionExpiredWatcher />
			<Routes>
				<Route path={HOME_ROUTE} element={<Home />} />
				<Route
					path={DASHBOARD_ROUTE}
					element={
						<AdminRoute>
							<Dashboard />
						</AdminRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
