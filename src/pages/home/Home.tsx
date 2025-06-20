import Layout from '@/layout';
import ProductsList from './components/ProductsList';

const Home = () => {
	return (
		<Layout>
			<div className='w-full min-h-screen bg-white'>
				<div className='pt-6 pb-12'>
					<ProductsList />
				</div>
			</div>
		</Layout>
	);
};

export default Home;
