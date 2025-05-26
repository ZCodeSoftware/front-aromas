import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import type { LayoutProps } from './models/layout-props.interface';

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='layout'>
			<Navbar />
			<main className='content'>{children}</main>
			<Footer />
		</div>
	);
};
export default Layout;
