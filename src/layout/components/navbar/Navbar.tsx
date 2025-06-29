import { useState } from 'react';
import { Search, UserRound, ShoppingBag } from 'lucide-react';
import SearchBar from './components/searchBar/SearchBar';

const Navbar = () => {
	const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

	if (typeof window !== 'undefined') {
		document.body.style.overflow = isSearchOpen ? 'hidden' : 'auto';
	}

	return (
		<header className='relative'>
			{isSearchOpen ? (
				<div className='mb-16'>
					<SearchBar onClose={() => setIsSearchOpen(false)} />
				</div>
			) : (
				<nav className='bg-aromas_nav_bg shadow-md py-4 px-8 flex justify-between items-center'>
					<div className='flex justify-between items-center w-[30%]'>
						<div className='text-xl font-bold text-aromas_fucsia'>
							Aromas y Armonía
						</div>
						<ul className='flex space-x-6'>
							<li>
								<a
									href='/'
									className='text-aromas_gray_text hover:text-gray-900'>
									Inicio
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900'>
									Velas
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900'>
									Inciensos
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900'>
									Accesorios
								</a>
							</li>
						</ul>
					</div>
					<div>
						<ul className='flex space-x-6 items-center'>
							<li>
								<button
									onClick={() => setIsSearchOpen(true)}
									className='text-aromas_gray_text hover:text-gray-900'>
									<Search />
								</button>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900'>
									<UserRound />
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900'>
									<ShoppingBag />
								</a>
							</li>
						</ul>
					</div>
				</nav>
			)}
		</header>
	);
};

export default Navbar;
