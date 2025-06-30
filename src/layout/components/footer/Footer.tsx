import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';
const Footer = () => {
	return (
		<footer className='bg-white py-8 px-16'>
			<div className='max-w-full mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='space-y-4'>
						<h1 className='text-2xl font-bold text-aromas_fucsia'>
							Aromas y Armonía
						</h1>
						<p className='text-aromas_aromas_gray_text'>
							Creamos velas aromáticas e inciensos artesanales
							para transformar tu espacio y mejorar tu bienestar.
						</p>
						<ul className='flex space-x-4'>
							<li className='rounded-full text-aromas_fucsia bg-aromas_icons_bg p-2 w-10 h-10 flex items-center justify-center'>
								<a href='#'>
									<Instagram />
								</a>
							</li>
							<li className='rounded-full text-aromas_fucsia bg-aromas_icons_bg p-2 w-10 h-10 flex items-center justify-center'>
								<a href='#'>
									<Facebook />
								</a>
							</li>
							<li className='rounded-full text-aromas_fucsia bg-aromas_icons_bg p-2 w-10 h-10 flex items-center justify-center'>
								<a href='#'>
									<Twitter />
								</a>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h2 className='text-lg font-semibold text-aromas_gray_text'>
							Enlaces
						</h2>
						<ul className='space-y-2'>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900 transition'>
									Inicio
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900 transition'>
									Productos
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900 transition'>
									Sobre nosotros
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900 transition'>
									Blog
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-aromas_gray_text hover:text-gray-900 transition'>
									Contacto
								</a>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h2 className='text-lg font-semibold text-aromas_gray_text'>
							Suscríbete
						</h2>
						<p className='text-gray-600'>
							Recibe nuestras novedades y ofertas especiales
						</p>
						<form className='space-y-3'>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-aromas_gray_text'>
								Tu email
							</label>
							<div className='flex'>
								<input
									type='email'
									id='email'
									placeholder='tu@email.com'
									className='flex-1 px-4 py-2 border border-aromas_fucsia rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-500'
								/>
								<button
									type='submit'
									className='bg-aromas_fucsia text-white px-4 py-2 rounded-r-full hover:bg-gray-700 transition'>
									<Mail className='text-white' />
								</button>
							</div>
						</form>
					</div>
				</div>

				<div className='border-t border-gray-200 my-8'></div>

				<div className='text-center text-gray-500 text-sm'>
					© 2025 Aromas y Armonía. Todos los derechos reservados.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
