import headerImage from '../../../../assets/Images/header-image.jpg';

const HeaderSection = () => {
	const handleScrollToProducts = () => {
		const productsSection = document.getElementById('products-section');
		if (productsSection) {
			productsSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	return (
		<div className='flex flex-col w-full h-full items-center justify-center gap-8 p-6 lg:flex-row lg:gap-x-24 lg:py-24'>
			<div className='flex w-full flex-col items-center text-center lg:w-2/5 lg:items-start lg:text-left'>
				<h1 className='text-3xl text-start font-semibold text-aromas_gray_text leading-tight md:text-5xl'>
					Aromas que transforman <br /> tu espacio
				</h1>

				<p className='mt-4 max-w-md text-base text-aromas_gray_text md:text-lg'>
					Descubre nuestra colección de velas aromáticas e inciensos
					artesanales creados para elevar tu bienestar
				</p>
				<div className='mt-8 flex gap-4 sm:flex-row'>
					<button
						onClick={handleScrollToProducts}
						className='rounded-full bg-aromas_pink px-8 py-3 font-semibold text-aromas_gray_text shadow-md transition-transform hover:scale-105'
						aria-label='Ver todos los productos'>
						Ver Productos
					</button>
					<button
						className='rounded-full border border-aromas_fucsia px-8 py-3 font-semibold text-aromas_fucsia transition-all hover:scale-105'
						aria-label='Ver ofertas especiales'>
						Ofertas
					</button>
				</div>
			</div>
			<div className='w-full max-w-lg lg:w-3/4'>
				<div className='relative h-[60vh] w-full overflow-hidden rounded-2xl shadow-xl lg:h-[70vh]'>
					<img
						src={headerImage}
						alt='Vela aromática'
						className='h-full w-full object-cover'
					/>
				</div>
			</div>
		</div>
	);
};

export default HeaderSection;
