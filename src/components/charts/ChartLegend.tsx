import { textureClass } from './chart-tokens';

export interface ILegendItem {
	label: string;
	color: string;
	/** Shown beside the label so the legend also carries the numbers. */
	value?: string;
	/** Mirror the mark: a rect for bars and areas, a line for lines. */
	shape?: 'rect' | 'line';
	/** Which hatch this series takes when colour is unavailable. */
	textureIndex?: number;
}

interface ChartLegendProps {
	items: ILegendItem[];
}

/**
 * Present whenever a chart carries two or more series — identity must never
 * rest on colour matching alone. Swatches are inline SVG rather than styled
 * spans so the forced-colours hatches still apply to them; the label text stays
 * in ink tokens, because a light categorical hue is illegible as text.
 */
const ChartLegend = ({ items }: ChartLegendProps) => (
	<ul className='flex flex-wrap items-center gap-x-4 gap-y-1.5'>
		{items.map((item, index) => (
			<li key={item.label} className='flex items-center gap-1.5'>
				<svg
					aria-hidden='true'
					focusable='false'
					width='12'
					height='12'
					className='shrink-0'>
					{item.shape === 'line' ? (
						<rect
							x='0'
							y='5'
							width='12'
							height='2'
							rx='1'
							fill={item.color}
							className={textureClass(
								item.textureIndex ?? index
							)}
						/>
					) : (
						<rect
							x='0'
							y='1'
							width='12'
							height='10'
							rx='2'
							fill={item.color}
							className={textureClass(
								item.textureIndex ?? index
							)}
						/>
					)}
				</svg>
				<span className='text-xs text-aromas_ink_muted'>
					{item.label}
				</span>
				{item.value && (
					<span className='text-xs font-semibold tabular-nums text-aromas_ink'>
						{item.value}
					</span>
				)}
			</li>
		))}
	</ul>
);

export default ChartLegend;
