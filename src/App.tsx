import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';
import { DASHBOARD_ROUTE, HOME_ROUTE } from './config/routes';
import { Dashboard } from './pages/dashboard';

function App() {
	return (
		<Router>
			<Routes>
				<Route path={HOME_ROUTE} element={<Home />} />
				<Route path={DASHBOARD_ROUTE} element={<Dashboard />} />
			</Routes>
		</Router>
	);
}

export default App;
