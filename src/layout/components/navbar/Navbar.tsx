import { Search, UserRound, ShoppingBag } from 'lucide-react';

const Navbar = () => {
	return (
		<nav className='bg-[#F8F5FF] shadow-md py-4 px-8 flex justify-between items-center'>
			<div className='flex justify-between items-center w-[30%]'>
				<div className='text-xl font-bold text-[#EB5480]'>
					Aromas y Armonía
				</div>
				<ul className='flex space-x-6'>
					<li>
						<a
							href='/'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							Inicio
						</a>
					</li>
					<li>
						<a
							href='#'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							Velas
						</a>
					</li>
					<li>
						<a
							href='#'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							Inciensos
						</a>
					</li>
					<li>
						<a
							href='#'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							Accesorios
						</a>
					</li>
				</ul>
			</div>
			<div>
				<ul className='flex space-x-6'>
					<li>
						<a
							href='#'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							<Search />
						</a>
					</li>
					<li>
						<a
							href='#'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							<UserRound />
						</a>
					</li>
					<li>
						<a
							href='#'
							className='text-[#373737] hover:text-gray-900 transition duration-300'>
							<ShoppingBag />
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
