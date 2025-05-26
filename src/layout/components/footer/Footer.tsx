import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';
const Footer = () => {
	return (
		<footer className='bg-[#FFFFFF] py-8 px-16'>
			<div className='max-w-full mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<div className='space-y-4'>
						<h1 className='text-2xl font-bold text-[#EB5480]'>
							Aromas y Armonía
						</h1>
						<p className='text-[#373737]'>
							Creamos velas aromáticas e inciensos artesanales
							para transformar tu espacio y mejorar tu bienestar.
						</p>
						<ul className='flex space-x-4'>
							<li className='rounded-full text-[#EB5480] bg-[#EDEDED] p-2 w-10 h-10 flex items-center justify-center mr-2'>
								<a href='#'>
									<Instagram />
								</a>
							</li>
							<li className='rounded-full text-[#EB5480] bg-[#EDEDED] p-2 w-10 h-10 flex items-center justify-center mr-2'>
								<a href='#'>
									<Facebook />
								</a>
							</li>
							<li className='rounded-full text-[#EB5480] bg-[#EDEDED] p-2 w-10 h-10 flex items-center justify-center mr-2'>
								<a href='#'>
									<Twitter />
								</a>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h2 className='text-lg font-semibold text-[#373737]'>
							Enlaces
						</h2>
						<ul className='space-y-2'>
							<li>
								<a
									href='#'
									className='text-[#373737] hover:text-gray-900 transition'>
									Inicio
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-[#373737] hover:text-gray-900 transition'>
									Productos
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-[#373737] hover:text-gray-900 transition'>
									Sobre nosotros
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-[#373737] hover:text-gray-900 transition'>
									Blog
								</a>
							</li>
							<li>
								<a
									href='#'
									className='text-[#373737] hover:text-gray-900 transition'>
									Contacto
								</a>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h2 className='text-lg font-semibold text-[#373737]'>
							Suscríbete
						</h2>
						<p className='text-gray-600'>
							Recibe nuestras novedades y ofertas especiales
						</p>
						<form className='space-y-3'>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-[#373737]'>
								Tu email
							</label>
							<div className='flex'>
								<input
									type='email'
									id='email'
									placeholder='tu@email.com'
									className='flex-1 px-4 py-2 border border-[#EB5480] rounded-l-full focus:outline-none focus:ring-1 focus:ring-gray-500'
								/>
								<button
									type='submit'
									className='bg-[#EB5480] text-white px-4 py-2 rounded-r-full hover:bg-gray-700 transition'>
									<Mail className='text-[#FFFFFF]' />
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
