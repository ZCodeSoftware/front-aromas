import { Card, CardContent } from '@/components/ui/card';

interface StatTileProps {
	label: string;
	value: string;
	hint?: string;
}

const StatTile = ({ label, value, hint }: StatTileProps) => {
	return (
		<Card className='py-4 gap-1'>
			<CardContent className='px-4 flex flex-col gap-1'>
				<span className='text-sm text-aromas_gray_text'>{label}</span>
				<span className='text-2xl font-semibold'>{value}</span>
				{hint && (
					<span className='text-xs text-aromas_gray_text/70'>
						{hint}
					</span>
				)}
			</CardContent>
		</Card>
	);
};

export default StatTile;
