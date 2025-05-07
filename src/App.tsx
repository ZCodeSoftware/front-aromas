import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages';
import { HOME_ROUTE } from './config/routes';

function App() {
	return (
		<Router>
			<Routes>
				<Route path={HOME_ROUTE} element={<Home />} />
			</Routes>
		</Router>
	);
}

export default App;
