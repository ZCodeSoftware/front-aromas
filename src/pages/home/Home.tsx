import Layout from '@/layout';
import ProductsContainer from './components/products-view/ProductsContainer';

const Home = () => {
	return (
		<Layout>
			<main className='w-full h-screen py-2'>
				<section>
					<ProductsContainer />
				</section>
			</main>
		</Layout>
	);
};

export default Home;
