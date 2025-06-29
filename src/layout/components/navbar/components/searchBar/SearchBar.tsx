import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

import { productsGetService } from '@/services/products/GET/products.service.get';
import type { IProductData } from '@/services/products/models/products.interface';

import { SearchResults } from './SearchResults';

interface SearchOverlayProps {
	onClose: () => void;
}

const SearchBar = ({ onClose }: SearchOverlayProps) => {
	const [query, setQuery] = useState<string>('');
	const [results, setResults] = useState<IProductData[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isClosing, setIsClosing] = useState(false);

	const handleClose = useCallback(() => {
		setIsClosing(true);

		setTimeout(() => {
			onClose();
			setIsClosing(false);
		}, 200);
	}, [onClose]);

	useEffect(() => {
		if (query.trim() === '') {
			setResults([]);
			return;
		}

		setIsLoading(true);
		const debounceTimer = setTimeout(() => {
			productsGetService
				.getProducts({ search: query })
				.then((response) => {
					setResults(response.data);
				})
				.catch((error) => {
					console.error('Error al buscar productos:', error);
					setResults([]);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}, 750);

		return () => clearTimeout(debounceTimer);
	}, [query]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleClose();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleClose]);

	return (
		<div
			className='fixed top-0 left-0 w-full h-full z-20'
			aria-modal='true'
			role='dialog'>
			<div
				onClick={handleClose}
				className='absolute inset-0 bg-black/30 backdrop-blur-lg overflow-hidden'></div>
			<div
				className={`relative bg-transparent  flex flex-col max-h-[40vh] ${
					isClosing ? 'animate-fade-out' : 'animate-fade-in'
				}`}>
				<div className='w-full shadow-md bg-aromas_nav_bg py-3 flex-shrink-0'>
					<div className='max-w-4xl mx-auto'>
						<div className='relative px-2'>
							<Search
								className='absolute left-4 top-1/2 -translate-y-1/2 text-aromas_fucsia mx-2'
								size={20}
							/>
							<input
								type='text'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder='Busca tus aromas favoritos...'
								autoFocus
								style={{
									outline: 'none',
									boxShadow: 'none',
									borderColor: '#EB5480',
								}}
								className='w-full bg-white border shadow-md border-gray-300 rounded-full py-2 pl-12 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-aromas_fucsia'
							/>
							<button
								onClick={handleClose}
								className='absolute right-4 top-1/2 -translate-y-1/2 text-aromas_gray_text hover:text-gray-900 mx-2'>
								<X size={24} />
							</button>
						</div>
					</div>
				</div>

				{query && (
					<div className='flex-grow pt-0 overflow-y-auto p-4 bg-white w-3/4 place-self-center rounded-b-lg'>
						<div className='max-w-4xl mx-auto'>
							<div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
								{isLoading && query && (
									<p className='text-aromas_gray_text col-span-full text-center'>
										Buscando...
									</p>
								)}

								{!isLoading &&
									query &&
									results.length === 0 && (
										<p className='text-aromas_gray_text col-span-full text-center'>
											No se encontraron resultados para "
											{query}".
										</p>
									)}

								{results.map((product) => (
									<SearchResults
										key={product._id}
										product={product}
									/>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchBar;
