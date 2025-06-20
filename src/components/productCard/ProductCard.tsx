import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import type { IProductCardProps } from './models/product-card.interface';
import image from '../../mocks/products/product-image/4aa78d0bf5eaaa872d7abca8bc632c6634de5da5.png';

const ProductCard = ({ product }: IProductCardProps) => {
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const descriptionRef = useRef<HTMLParagraphElement>(null);

	const [isTextOverflowing, setIsTextOverflowing] = useState(false);

	useEffect(() => {
		const element = descriptionRef.current;

		const checkOverflow = () => {
			if (element) {
				const hasOverflow = element.scrollHeight > element.clientHeight;
				setIsTextOverflowing(hasOverflow);
			}
		};

		checkOverflow();

		window.addEventListener('resize', checkOverflow);

		return () => {
			window.removeEventListener('resize', checkOverflow);
		};
	}, [product.description]);

	const handleMouseEnter = (e: React.MouseEvent) => {
		if (isTextOverflowing) {
			const rect = e.currentTarget.getBoundingClientRect();
			setTooltipPosition({
				x: rect.left + rect.width / 2,
				y: rect.top - 10,
			});
			setShowTooltip(true);
		}
	};

	const handleMouseLeave = () => {
		setShowTooltip(false);
	};

	return (
		<>
			<Card className='bg-transparent border-none shadow-none rounded-2xl overflow-hidden max-w-[400px] min-h-[300px] flex flex-col'>
				<CardHeader className='p-3 pb-1'>
					<div className='w-full aspect-square rounded-xl overflow-hidden bg-white'>
						<img
							src={image}
							alt={product.name}
							className='object-cover w-full h-full'
						/>
					</div>
				</CardHeader>
				<CardContent className='px-3 flex-1 flex flex-col justify-between'>
					<div>
						<CardTitle className='font-finlandica text-md font-semibold text-gray-900 mb-1'>
							{product.name}
						</CardTitle>
						<CardDescription
							ref={descriptionRef}
							className={`text-xs text-gray-900 font-normal line-clamp-2 leading-4 mb-2 relative ${
								isTextOverflowing
									? 'cursor-help'
									: 'cursor-default'
							}`}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
							style={{
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}>
							{product.description}
						</CardDescription>
					</div>
					<div>
						<p className='text-md font-semibold text-gray-900'>
							${product.price}
						</p>
					</div>
				</CardContent>
				<CardFooter className='px-3 pb-3 mt-auto'>
					<CardAction className='w-full'>
						<button className='font-finlandica lg:w-3/12 w-full bg-black text-white py-2 px-4 rounded-full text-md font-medium hover:bg-gray-800 transition-colors duration-300 cursor-pointer'>
							Añadir
						</button>
					</CardAction>
				</CardFooter>
			</Card>
			{showTooltip && (
				<div
					className='fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg pointer-events-none'
					style={{
						left: tooltipPosition.x,
						top: tooltipPosition.y,
						transform: 'translate(-50%, -100%)',
					}}>
					{product.description}
					<div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
				</div>
			)}
		</>
	);
};

export default ProductCard;
