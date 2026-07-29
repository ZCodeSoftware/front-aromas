import { useEffect, useState } from 'react';
import {
	Search,
	UserRound,
	ShoppingBag,
	Menu,
	// Settings
} from 'lucide-react';
import SearchBar from './components/searchBar/SearchBar';
import Profile from '@/pages/profile/Profile';
import Cart from '@/pages/cart/Cart';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useModalStore } from '@/stores/modal.store';
import { useCartStore } from '@/stores/cart.store';

const Navbar = () => {
	const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const openModal = useModalStore((state) => state.open);
	const totalCartItems = useCartStore((state) => state.getTotalItems());
	const fetchCart = useCartStore((state) => state.fetchCart);

	useEffect(() => {
		if (isAuthenticated) fetchCart();
	}, [isAuthenticated, fetchCart]);

	if (typeof window !== 'undefined') {
		document.body.style.overflow =
			isSearchOpen || isProfileModalOpen || isCartOpen
				? 'hidden'
				: 'auto';
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
						<div className='text-xl text-center font-bold text-aromas_fucsia'>
							Aromas y Armonía
						</div>
						<ul className='hidden lg:flex space-x-6 text-center md:ml-6'>
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
							{/* <li>
								<a
									href='/dashboard'
									className='flex text-aromas_gray_text hover:text-gray-900'>
									<Settings />
								</a>
							</li> */}
							<li>
								<button
									onClick={() => setIsSearchOpen(true)}
									className='flex text-aromas_gray_text hover:text-gray-900'>
									<Search />
								</button>
							</li>
							<li>
								{isAuthenticated ? (
									<button
										onClick={() =>
											setIsProfileModalOpen(true)
										}
										className='flex text-aromas_gray_text hover:text-gray-900'>
										<UserRound />
									</button>
								) : (
									<Popover>
										<PopoverTrigger asChild>
											<button className='flex text-aromas_gray_text hover:text-gray-900'>
												<UserRound />
											</button>
										</PopoverTrigger>
										<PopoverContent
											align='end'
											className='flex w-48 flex-col gap-2 p-3 bg-aromas_nav_bg'>
											<Button
												variant='outline'
												className='rounded-full border-aromas_pink text-aromas_gray_text hover:bg-aromas_pink/10'
												onClick={() =>
													openModal('login')
												}>
												Iniciar sesión
											</Button>
											<Button
												className='rounded-full bg-aromas_pink text-aromas_gray_text hover:bg-aromas_pink/80'
												onClick={() =>
													openModal('signup')
												}>
												Registrarse
											</Button>
										</PopoverContent>
									</Popover>
								)}
							</li>
							<li>
								<button
									onClick={() => setIsCartOpen(true)}
									className='relative flex text-aromas_gray_text hover:text-gray-900'>
									<ShoppingBag />
									{totalCartItems > 0 && (
										<span className='absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-aromas_fucsia px-1 text-[10px] font-bold text-white'>
											{totalCartItems}
										</span>
									)}
								</button>
							</li>
							<li className='flex lg:hidden'>
								<Menu />
							</li>
						</ul>
					</div>
				</nav>
			)}
			{isProfileModalOpen && (
				<Profile onClose={() => setIsProfileModalOpen(false)} />
			)}
			{isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
		</header>
	);
};

export default Navbar;
