import { Heart, ShoppingBag } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import type { IProductCardProps } from './models/product-card.interface';

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
		return () => window.removeEventListener('resize', checkOverflow);
	}, [product.description]);

	const handleMouseEnter = (e: React.MouseEvent) => {
		if (isTextOverflowing) {
			const rect = e.currentTarget.getBoundingClientRect();
			setTooltipPosition({
				x: rect.left + rect.width / 2,
				y: rect.top,
			});
			setShowTooltip(true);
		}
	};

	const handleMouseLeave = () => {
		setShowTooltip(false);
	};

	return (
		<>
			<Card className='w-full max-w-[389px] h-[420px] rounded-2xl overflow-hidden shadow-none bg-aromas_home_bg border-none flex flex-col gap-4 py-0'>
				<div className='relative'>
					<div className='w-full aspect-[16/9] h-64'>
						<img
							src={product.images[0]}
							alt={product.name}
							className='object-cover w-full h-full rounded-lg'
						/>
					</div>
					<button className='absolute top-3 right-3 bg-aromas_home_bg p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors hover:cursor-pointer'>
						<Heart
							className='h-5 w-5 text-aromas_fucsia'
							strokeWidth={1.5}
						/>
					</button>
				</div>
				<CardContent className='px-2 flex-1 flex flex-col'>
					<div className='flex justify-between items-start mb-2'>
						<CardTitle className='text-lg font-bold text-aromas_gray_text'>
							{product.name}
						</CardTitle>
						<p className='text-lg font-bold text-aromas_fucsia whitespace-nowrap pl-4'>
							${product.price}
						</p>
					</div>
					<CardDescription
						ref={descriptionRef}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className={`text-aromas_gray_text text-sm line-clamp-2 ${
							isTextOverflowing ? 'cursor-help' : 'cursor-default'
						}`}>
						{product.description}
					</CardDescription>
				</CardContent>
				<CardFooter className='py-2 px-0 pt-0 mt-auto'>
					<button className='w-full bg-aromas_pink text-aromas_gray_text font-bold py-2 px-4 rounded-3xl flex items-center justify-center gap-2 border border-transparent hover:border-aromas_fucsia transition-colors hover:cursor-pointer'>
						<ShoppingBag className='h-5 w-5' />
						<span>Añadir al carrito</span>
					</button>
				</CardFooter>
			</Card>
			{showTooltip && (
				<div
					className='fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg pointer-events-none'
					style={{
						left: tooltipPosition.x,
						top: tooltipPosition.y,
						transform: 'translate(-50%, -110%)',
					}}>
					{product.description}
					<div className='absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900'></div>
				</div>
			)}
		</>
	);
};

export default ProductCard;
