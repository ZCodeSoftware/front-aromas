import { useState } from 'react';
import type { ISalesPoint } from '@/services/analytics/models/analytics.interface';
import { formatCurrency, formatDateLabel } from './utils/format';

interface SalesTimeseriesChartProps {
	points: ISalesPoint[];
}

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 12, right: 12, bottom: 28, left: 64 };
const BAR_COLOR = '#2a78d6';
const GRID_COLOR = '#e1e0d9';
const AXIS_COLOR = '#898781';

const roundedTopBarPath = (
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
): string => {
	const radius = Math.min(r, w / 2, Math.max(h, 0));
	if (h <= 0) return '';
	return `M${x},${y + h} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} Z`;
};

const niceMax = (value: number): number => {
	if (value <= 0) return 1;
	const magnitude = 10 ** Math.floor(Math.log10(value));
	const steps = [1, 2, 2.5, 5, 10];
	for (const step of steps) {
		const candidate = step * magnitude;
		if (candidate >= value) return candidate;
	}
	return value;
};

const SalesTimeseriesChart = ({ points }: SalesTimeseriesChartProps) => {
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);

	if (points.length === 0) {
		return (
			<div className='w-full h-56 flex items-center justify-center text-sm text-aromas_gray_text/70'>
				Sin datos para el período seleccionado.
			</div>
		);
	}

	const innerWidth = WIDTH - PADDING.left - PADDING.right;
	const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
	const maxRevenue = niceMax(Math.max(...points.map((p) => p.revenue)));
	const slot = innerWidth / points.length;
	const barWidth = Math.max(2, Math.min(24, slot - 6));
	const gridLines = [0, 0.25, 0.5, 0.75, 1];
	const hovered = hoverIndex !== null ? points[hoverIndex] : null;
	const hoveredX =
		hoverIndex !== null
			? PADDING.left + hoverIndex * slot + slot / 2
			: 0;

	return (
		<div className='w-full'>
			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				className='w-full h-56'
				role='img'
				aria-label='Ingresos por período'>
				{gridLines.map((fraction) => {
					const y = PADDING.top + innerHeight * (1 - fraction);
					return (
						<g key={fraction}>
							<line
								x1={PADDING.left}
								x2={WIDTH - PADDING.right}
								y1={y}
								y2={y}
								stroke={GRID_COLOR}
								strokeWidth={1}
							/>
							<text
								x={PADDING.left - 8}
								y={y + 3}
								textAnchor='end'
								fontSize={10}
								fill={AXIS_COLOR}>
								{formatCurrency(maxRevenue * fraction)}
							</text>
						</g>
					);
				})}
				{points.map((point, index) => {
					const x = PADDING.left + index * slot + (slot - barWidth) / 2;
					const barHeight = (point.revenue / maxRevenue) * innerHeight;
					const y = PADDING.top + innerHeight - barHeight;
					const showLabel =
						points.length <= 14 ||
						index === 0 ||
						index === points.length - 1;
					return (
						<g key={point.bucket}>
							<path
								d={roundedTopBarPath(x, y, barWidth, barHeight, 4)}
								fill={BAR_COLOR}
								opacity={point.partial ? 0.5 : 1}
							/>
							<rect
								x={PADDING.left + index * slot}
								y={PADDING.top}
								width={slot}
								height={innerHeight}
								fill='transparent'
								onMouseEnter={() => setHoverIndex(index)}
								onMouseLeave={() => setHoverIndex(null)}
								onFocus={() => setHoverIndex(index)}
								onBlur={() => setHoverIndex(null)}
								tabIndex={0}
							/>
							{showLabel && (
								<text
									x={x + barWidth / 2}
									y={HEIGHT - PADDING.bottom + 14}
									textAnchor='middle'
									fontSize={10}
									fill={AXIS_COLOR}>
									{formatDateLabel(point.bucket)}
								</text>
							)}
						</g>
					);
				})}
				<line
					x1={PADDING.left}
					x2={WIDTH - PADDING.right}
					y1={PADDING.top + innerHeight}
					y2={PADDING.top + innerHeight}
					stroke='#c3c2b7'
					strokeWidth={1}
				/>
				{hovered && (
					<g
						transform={`translate(${Math.min(
							Math.max(hoveredX - 66, PADDING.left),
							WIDTH - PADDING.right - 132
						)}, ${PADDING.top})`}>
						<rect
							width={132}
							height={hovered.partial ? 60 : 46}
							rx={4}
							fill='#fcfcfb'
							stroke='#c3c2b7'
							strokeWidth={1}
						/>
						<text x={8} y={16} fontSize={10} fill='#52514e'>
							{formatDateLabel(hovered.bucket)}
						</text>
						<text x={8} y={30} fontSize={11} fontWeight={600} fill='#0b0b0b'>
							{formatCurrency(hovered.revenue)}
						</text>
						<text x={8} y={42} fontSize={10} fill='#52514e'>
							{hovered.orders} órdenes
						</text>
						{hovered.partial && (
							<text x={8} y={54} fontSize={10} fill='#898781'>
								Período parcial
							</text>
						)}
					</g>
				)}
			</svg>
		</div>
	);
};

export default SalesTimeseriesChart;
