import Layout from '@/layout';
import { toast } from 'sonner';

const Home = () => {
	return (
		<Layout>
			<div className='w-full h-screen flex flex-col items-center justify-center'>
				<h1>Home</h1>
				<p>Welcome to the home page!</p>
				<button
					onClick={() => toast.success('este es el home')}
					className='bg-blue-500 text-white mt-2 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer'>
					HOLA
				</button>
			</div>
		</Layout>
	);
};

export default Home;
