import { useMemo } from 'react';
import ChartFigure from './ChartFigure';
import ChartLegend from './ChartLegend';
import ChartPlot from './ChartPlot';
import ChartTooltip, { TOOLTIP_WIDTH } from './ChartTooltip';
import { useChartCursor } from './chart-hooks';
import {
	AXIS_FONT_SIZE,
	CHART,
	LABEL_FONT_SIZE,
	MARK,
	seriesColor,
} from './chart-tokens';
import {
	approxTextWidth,
	areaPath,
	clampToWidth,
	labelStride,
	linePath,
	niceMax,
	ticksTo,
} from './chart-scale';

export interface ILineSeries {
	key: string;
	name: string;
	values: number[];
}

interface LineAreaChartProps {
	title: string;
	description?: string;
	footnote?: string;
	labels: string[];
	series: ILineSeries[];
	categoryLabel: string;
	formatValue: (value: number) => string;
	formatTick?: (value: number) => string;
	summary: string;
	height?: number;
	isStale?: boolean;
}

const PADDING = { top: 20, right: 14, bottom: 34 };
/** Below this gap two end-labels read as noise, so both are dropped. */
const LABEL_COLLISION_GAP = 15;

/**
 * Trend over time, one axis only.
 *
 * A single series gets the 10% area wash and no legend; two or more get a
 * legend plus end-labels when they separate enough at the right edge. Two
 * measures of different magnitude are never put on one plot with two scales —
 * that invents a correlation the data does not have — so callers stack two of
 * these instead.
 */
const LineAreaChart = ({
	title,
	description,
	footnote,
	labels,
	series,
	categoryLabel,
	formatValue,
	formatTick,
	summary,
	height = 250,
	isStale = false,
}: LineAreaChartProps) => {
	const tickFormatter = formatTick ?? formatValue;

	const cursor = useChartCursor(labels.length, (index) =>
		[
			labels[index],
			...series.map(
				(one) => `${one.name}: ${formatValue(one.values[index] ?? 0)}`
			),
		].join('. ')
	);

	const table = useMemo(
		() => ({
			columns: [categoryLabel, ...series.map((one) => one.name)],
			rows: labels.map((label, index) => [
				label,
				...series.map((one) => formatValue(one.values[index] ?? 0)),
			]),
		}),
		[labels, series, categoryLabel, formatValue]
	);

	const maxValue = niceMax(
		Math.max(0, ...series.flatMap((one) => one.values))
	);
	const ticks = ticksTo(maxValue, 4);
	const axisWidth =
		approxTextWidth(tickFormatter(maxValue), AXIS_FONT_SIZE) + 14;

	return (
		<ChartFigure
			title={title}
			description={description}
			footnote={footnote}
			table={table}
			isEmpty={labels.length === 0}
			isStale={isStale}
			legend={
				series.length > 1 ? (
					<ChartLegend
						items={series.map((one, index) => ({
							label: one.name,
							color: seriesColor(index),
							shape: 'line',
							textureIndex: index,
						}))}
					/>
				) : undefined
			}>
			<ChartPlot label={summary} height={height} cursor={cursor}>
				{(width) => {
					const plotLeft = axisWidth;
					const plotWidth = Math.max(
						40,
						width - plotLeft - PADDING.right
					);
					const plotHeight = height - PADDING.top - PADDING.bottom;
					const baselineY = PADDING.top + plotHeight;
					const step =
						labels.length > 1 ? plotWidth / (labels.length - 1) : 0;
					const xAt = (index: number) =>
						labels.length > 1
							? plotLeft + step * index
							: plotLeft + plotWidth / 2;
					const yAt = (value: number) =>
						baselineY -
						(maxValue === 0 ? 0 : (value / maxValue) * plotHeight);

					const stride = labelStride(
						labels.length,
						plotWidth,
						approxTextWidth('00/00', AXIS_FONT_SIZE) + 10
					);

					const endY = series.map((one) =>
						yAt(one.values[one.values.length - 1] ?? 0)
					);
					const sortedEnds = [...endY].sort((a, b) => a - b);
					const endLabelsCollide = sortedEnds.some(
						(value, index) =>
							index > 0 &&
							value - sortedEnds[index - 1] < LABEL_COLLISION_GAP
					);
					const showEndLabels =
						series.length <= 4 && !endLabelsCollide;

					return (
						<>
							<svg
								aria-hidden='true'
								focusable='false'
								width={width}
								height={height}
								className='block'>
								{ticks.map((tick) => (
									<g key={tick}>
										<line
											x1={plotLeft}
											x2={plotLeft + plotWidth}
											y1={yAt(tick)}
											y2={yAt(tick)}
											stroke={CHART.grid}
											strokeWidth={1}
										/>
										<text
											x={plotLeft - 8}
											y={yAt(tick) + 4}
											textAnchor='end'
											fontSize={AXIS_FONT_SIZE}
											fill={CHART.inkAxis}
											className='tabular-nums'>
											{tickFormatter(tick)}
										</text>
									</g>
								))}

								{labels.map((label, index) =>
									index % stride === 0 ? (
										<text
											key={`${label}-${index}`}
											x={xAt(index)}
											y={baselineY + 18}
											textAnchor='middle'
											fontSize={AXIS_FONT_SIZE}
											fill={CHART.inkAxis}>
											{label}
										</text>
									) : null
								)}

								<line
									x1={plotLeft}
									x2={plotLeft + plotWidth}
									y1={baselineY}
									y2={baselineY}
									stroke={CHART.baseline}
									strokeWidth={1}
								/>

								{cursor.index !== null && (
									<line
										x1={xAt(cursor.index)}
										x2={xAt(cursor.index)}
										y1={PADDING.top}
										y2={baselineY}
										stroke={CHART.baseline}
										strokeWidth={1}
									/>
								)}

								{series.map((one, seriesIndex) => {
									const coordinates = one.values.map(
										(value, index) => ({
											x: xAt(index),
											y: yAt(value),
										})
									);
									const color = seriesColor(seriesIndex);

									return (
										<g key={one.key}>
											{series.length === 1 && (
												<path
													d={areaPath(
														coordinates,
														baselineY
													)}
													fill={color}
													opacity={MARK.areaOpacity}
												/>
											)}
											<path
												d={linePath(coordinates)}
												fill='none'
												stroke={color}
												strokeWidth={MARK.lineWidth}
												strokeLinecap='round'
												strokeLinejoin='round'
												className='viz-forced-stroke'
											/>
											{coordinates.length > 0 && (
												<circle
													cx={
														coordinates[
															coordinates.length -
																1
														].x
													}
													cy={
														coordinates[
															coordinates.length -
																1
														].y
													}
													r={MARK.markerRadius}
													fill={color}
													stroke={CHART.surface}
													strokeWidth={
														MARK.surfaceGap
													}
												/>
											)}
											{cursor.index !== null && (
												<circle
													cx={xAt(cursor.index)}
													cy={yAt(
														one.values[
															cursor.index
														] ?? 0
													)}
													r={MARK.markerRadius}
													fill={color}
													stroke={CHART.surface}
													strokeWidth={
														MARK.surfaceGap
													}
												/>
											)}
											{showEndLabels &&
												coordinates.length > 0 && (
													<text
														x={
															coordinates[
																coordinates
																	.length - 1
															].x - 8
														}
														y={
															endY[seriesIndex] -
															10
														}
														textAnchor='end'
														fontSize={
															LABEL_FONT_SIZE
														}
														fontWeight={600}
														fill={CHART.ink}
														className='tabular-nums'>
														{tickFormatter(
															one.values[
																one.values
																	.length - 1
															] ?? 0
														)}
													</text>
												)}
										</g>
									);
								})}

								{/*
								 * The crosshair finds the X: readers aim at a
								 * date, never at a 2px line, so each slot owns
								 * a full-height hit band.
								 */}
								{labels.map((label, index) => (
									<rect
										key={`hit-${label}-${index}`}
										x={xAt(index) - Math.max(step, MARK.minHitTarget) / 2}
										y={PADDING.top}
										width={Math.max(
											step,
											MARK.minHitTarget
										)}
										height={plotHeight}
										fill='transparent'
										onPointerEnter={() =>
											cursor.setIndex(index)
										}
									/>
								))}
							</svg>

							{cursor.index !== null && (
								<ChartTooltip
									left={clampToWidth(
										xAt(cursor.index) - TOOLTIP_WIDTH / 2,
										TOOLTIP_WIDTH,
										width
									)}
									top={PADDING.top}
									heading={labels[cursor.index]}
									rows={series.map((one, index) => ({
										color: seriesColor(index),
										label: one.name,
										value: formatValue(
											one.values[cursor.index ?? 0] ?? 0
										),
									}))}
								/>
							)}
						</>
					);
				}}
			</ChartPlot>
		</ChartFigure>
	);
};

export default LineAreaChart;
