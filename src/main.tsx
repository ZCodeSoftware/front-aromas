import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from 'sonner';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
		<Toaster position='top-right' richColors />
	</StrictMode>
);
