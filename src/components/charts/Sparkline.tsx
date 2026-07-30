import { CHART, MARK, seriesColor } from './chart-tokens';
import { areaPath, linePath } from './chart-scale';

interface SparklineProps {
	values: number[];
	width?: number;
	height?: number;
	/** Draw the last point in the accent hue; the rest stay de-emphasised. */
	highlightLast?: boolean;
}

/**
 * The trend half of a stat tile: shape only, no axes, no labels.
 *
 * Hidden from assistive technology on purpose. A sparkline has no readable
 * values, so announcing it would only add "image" to the tile; the tile itself
 * states the trend in words next to the figure, which is the accessible route.
 */
const Sparkline = ({
	values,
	width = 96,
	height = 28,
	highlightLast = true,
}: SparklineProps) => {
	if (values.length < 2) return null;

	const max = Math.max(...values);
	const min = Math.min(...values);
	const span = max - min || 1;
	const step = width / (values.length - 1);
	const points = values.map((value, index) => ({
		x: index * step,
		y: height - 3 - ((value - min) / span) * (height - 6),
	}));
	const last = points[points.length - 1];

	return (
		<svg
			aria-hidden='true'
			focusable='false'
			width={width}
			height={height}
			className='block shrink-0'>
			<path
				d={areaPath(points, height)}
				fill={seriesColor(0)}
				opacity={MARK.areaOpacity}
			/>
			<path
				d={linePath(points)}
				fill='none'
				stroke={seriesColor(0)}
				strokeWidth={MARK.lineWidth}
				strokeLinecap='round'
				strokeLinejoin='round'
				className='viz-forced-stroke'
			/>
			{highlightLast && (
				<circle
					cx={last.x}
					cy={last.y}
					r={3}
					fill={seriesColor(0)}
					stroke={CHART.surface}
					strokeWidth={MARK.surfaceGap}
				/>
			)}
		</svg>
	);
};

export default Sparkline;
