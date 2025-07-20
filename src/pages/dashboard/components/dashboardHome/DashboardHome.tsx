import { Flame } from 'lucide-react';

const DashboardHome = () => {
	return (
		<div className='w-full h-[90vh] flex flex-col justify-start items-center overflo-hidden'>
			<div className='w-full h-2/4 flex flex-col justify-center items-center space-y-6'>
				<Flame size={72} />
				<div className='text-center'>
					<h1 className='text-5xl font-serif mb-2'>
						Aromas y armonía
					</h1>
					<span className='text-lg text-nowrap text-center font-serif'>
						Aromas que transforman tu espacio
					</span>
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;
