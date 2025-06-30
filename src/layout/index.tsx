import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import type { LayoutProps } from './models/layout-props.interface';

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='flex flex-col min-h-screen mb-12 md:mb-0'>
			<Navbar />
			<main className='flex-grow flex flex-col items-center justify-center'>
				{children}
			</main>
			<Footer />
		</div>
	);
};
export default Layout;
