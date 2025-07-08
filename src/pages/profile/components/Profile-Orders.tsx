import productImage from '../../../mocks/products/product-image/dd0ae5f22f356d984fc7741ecaf2df9dcda764a3.png';

const ProfileOrders = () => {
	return (
		<main className='flex-1 p-6 overflow-y-auto'>
			<div className='w-full mb-6'>
				<div>
					<div className='flex flex-col text-sm mb-4'>
						<div className='flex justify-between'>
							<p>Pedido #1</p>
							<button
								className='px-2 bg-[#DCFCE7] text-aromas_success rounded-lg'
								disabled>
								Completado
							</button>
						</div>
						<span>2023-11-15</span>
					</div>
					<div className='flex flex-col gap-y-4 mb-6'>
						<a
							href='#'
							className='flex items-center space-x-4 hover:bg-aromas_nav_bg rounded-lg cursor-pointer'>
							<img
								src={productImage}
								alt={'nombre'}
								className='w-16 h-16 rounded-lg object-cover bg-white'
							/>
							<div className='w-full'>
								<p className='text-aromas_gray_text font-bold'>
									{'Vela Lavanda Relajante'}
								</p>
								<div className='w-2/4 flex justify-between'>
									<p className='text-aromas_gray_text font-medium'>
										{'Cantidad: 2'}
									</p>
									<span>x</span>
									<p className='text-aromas_gray_text font-medium'>
										${2000}
									</p>
								</div>
							</div>
						</a>
						<a
							href='#'
							className='flex items-center space-x-4 hover:bg-aromas_nav_bg rounded-lg cursor-pointer'>
							<img
								src={productImage}
								alt={'nombre'}
								className='w-16 h-16 rounded-lg object-cover bg-white'
							/>
							<div className='w-full'>
								<p className='text-aromas_gray_text font-bold'>
									{'Vela Lavanda Relajante'}
								</p>
								<div className='w-2/4 flex justify-between'>
									<p className='text-aromas_gray_text font-medium'>
										{'Cantidad: 2'}
									</p>
									<span>x</span>
									<p className='text-aromas_gray_text font-medium'>
										${2000}
									</p>
								</div>
							</div>
						</a>
					</div>
				</div>
				<div className='flex justify-between text-lg'>
					<h2 className='text-aromas_gray_text font-semibold'>
						Total
					</h2>
					<p className='text-aromas_fucsia font-semibold'>$4000</p>
				</div>
			</div>
		</main>
	);
};

export default ProfileOrders;
