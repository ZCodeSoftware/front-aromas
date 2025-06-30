import Layout from '@/layout';
import ProductsContainer from './components/products-view/ProductsContainer';
import HeaderSection from './components/header-section/HeaderSection';

const Home = () => {
	return (
		<Layout>
			<main className='w-full'>
				<div>
					<section className='bg-gradient-to-b from-aromas_header_bg_gradient_1 to-aromas_home_bg h-full pb-4'>
						<HeaderSection />
					</section>
					<section
						id='products-section'
						className='bg-aromas_home_bg py-4'>
						<ProductsContainer />
					</section>
				</div>
			</main>
		</Layout>
	);
};

export default Home;
