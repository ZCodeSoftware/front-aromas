import { useMemo } from 'react';
import ChartFigure from './ChartFigure';
import ChartPlot from './ChartPlot';
import ChartTooltip, { TOOLTIP_WIDTH } from './ChartTooltip';
import { useChartCursor } from './chart-hooks';
import {
	AXIS_FONT_SIZE,
	CHART,
	LABEL_FONT_SIZE,
	MARK,
	seriesColor,
	textureClass,
} from './chart-tokens';
import {
	approxTextWidth,
	barPath,
	barThickness,
	clampToWidth,
	labelStride,
	niceMax,
	ticksTo,
} from './chart-scale';

export interface IColumnPoint {
	key: string;
	/** X-axis label. */
	label: string;
	value: number;
	/** Rendered at reduced opacity, for a bucket that runs past the range. */
	isPartial?: boolean;
	/** Extra rows for the tooltip, the announcement and the table. */
	detail?: { label: string; value: string }[];
}

interface ColumnChartProps {
	title: string;
	description?: string;
	footnote?: string;
	points: IColumnPoint[];
	/** Name of the plotted measure, e.g. "Ingresos". */
	valueLabel: string;
	/** Name of the category axis, e.g. "Período". */
	categoryLabel: string;
	formatValue: (value: number) => string;
	/** Short compact form for axis ticks and in-plot labels. */
	formatTick?: (value: number) => string;
	/** One sentence for assistive technology, in place of the drawing. */
	summary: string;
	height?: number;
	isStale?: boolean;
}

const PADDING = { top: 20, right: 10, bottom: 34 };

/**
 * Columns for a measure over time.
 *
 * One series, so one hue and no legend — the caption already names what is
 * plotted. Only the tallest column is direct-labelled: a number on every cap is
 * chaos, and the axis, the tooltip and the table carry the rest.
 */
const ColumnChart = ({
	title,
	description,
	footnote,
	points,
	valueLabel,
	categoryLabel,
	formatValue,
	formatTick,
	summary,
	height = 250,
	isStale = false,
}: ColumnChartProps) => {
	const tickFormatter = formatTick ?? formatValue;

	const cursor = useChartCursor(points.length, (index) => {
		const point = points[index];
		const extras = (point.detail ?? [])
			.map((row) => `${row.label}: ${row.value}`)
			.join(', ');
		return [
			`${point.label}: ${formatValue(point.value)}`,
			extras,
			point.isPartial ? 'período parcial' : '',
		]
			.filter(Boolean)
			.join('. ');
	});

	const table = useMemo(() => {
		const detailColumns = points[0]?.detail?.map((row) => row.label) ?? [];
		return {
			columns: [categoryLabel, valueLabel, ...detailColumns],
			rows: points.map((point) => [
				point.isPartial ? `${point.label} (parcial)` : point.label,
				formatValue(point.value),
				...(point.detail ?? []).map((row) => row.value),
			]),
		};
	}, [points, categoryLabel, valueLabel, formatValue]);

	const maxValue = niceMax(Math.max(0, ...points.map((p) => p.value)));
	const ticks = ticksTo(maxValue, 4);
	const axisWidth =
		approxTextWidth(tickFormatter(maxValue), AXIS_FONT_SIZE) + 14;
	const peakIndex = points.reduce(
		(best, point, index) => (point.value > points[best].value ? index : best),
		0
	);

	return (
		<ChartFigure
			title={title}
			description={description}
			footnote={footnote}
			table={table}
			isEmpty={points.length === 0}
			isStale={isStale}>
			<ChartPlot label={summary} height={height} cursor={cursor}>
				{(width) => {
					const plotLeft = axisWidth;
					const plotWidth = Math.max(
						40,
						width - plotLeft - PADDING.right
					);
					const plotHeight = height - PADDING.top - PADDING.bottom;
					const baselineY = PADDING.top + plotHeight;
					const band = plotWidth / points.length;
					const thickness = barThickness(
						band,
						MARK.maxBarThickness,
						MARK.surfaceGap
					);
					const stride = labelStride(
						points.length,
						plotWidth,
						approxTextWidth('00/00', AXIS_FONT_SIZE) + 10
					);
					const active =
						cursor.index === null ? null : points[cursor.index];
					const activeCenter =
						cursor.index === null
							? 0
							: plotLeft + band * cursor.index + band / 2;

					return (
						<>
							<svg
								aria-hidden='true'
								focusable='false'
								width={width}
								height={height}
								className='block'>
								{ticks.map((tick) => {
									const y =
										baselineY -
										(tick / maxValue) * plotHeight;
									return (
										<g key={tick}>
											<line
												x1={plotLeft}
												x2={plotLeft + plotWidth}
												y1={y}
												y2={y}
												stroke={CHART.grid}
												strokeWidth={1}
											/>
											<text
												x={plotLeft - 8}
												y={y + 4}
												textAnchor='end'
												fontSize={AXIS_FONT_SIZE}
												fill={CHART.inkAxis}
												className='tabular-nums'>
												{tickFormatter(tick)}
											</text>
										</g>
									);
								})}

								{points.map((point, index) => {
									const barHeight =
										maxValue === 0
											? 0
											: (point.value / maxValue) *
												plotHeight;
									const x =
										plotLeft +
										band * index +
										(band - thickness) / 2;
									const y = baselineY - barHeight;
									const isActive = cursor.index === index;
									const showLabel =
										index === peakIndex &&
										point.value > 0 &&
										approxTextWidth(
											tickFormatter(point.value),
											LABEL_FONT_SIZE
										) <=
											band * 1.6;

									return (
										<g key={point.key}>
											{isActive && (
												<rect
													x={plotLeft + band * index}
													y={PADDING.top}
													width={band}
													height={plotHeight}
													fill={CHART.ink}
													opacity={0.06}
												/>
											)}
											<path
												d={barPath(
													x,
													y,
													thickness,
													barHeight,
													MARK.barRadius,
													'up'
												)}
												fill={seriesColor(0)}
												className={textureClass(0)}
												opacity={
													point.isPartial ? 0.55 : 1
												}
											/>
											{showLabel && (
												<text
													x={x + thickness / 2}
													y={y - 6}
													textAnchor='middle'
													fontSize={LABEL_FONT_SIZE}
													fontWeight={600}
													fill={CHART.ink}
													className='tabular-nums'>
													{tickFormatter(point.value)}
												</text>
											)}
											{index % stride === 0 && (
												<text
													x={
														plotLeft +
														band * index +
														band / 2
													}
													y={baselineY + 18}
													textAnchor='middle'
													fontSize={AXIS_FONT_SIZE}
													fill={CHART.inkAxis}>
													{point.label}
												</text>
											)}
											{/*
											 * The hit area is the whole band,
											 * never just the painted bar: a
											 * 4px-wide column is a pinpoint.
											 */}
											<rect
												x={plotLeft + band * index}
												y={PADDING.top}
												width={Math.max(
													band,
													MARK.minHitTarget
												)}
												height={plotHeight}
												fill='transparent'
												onPointerEnter={() =>
													cursor.setIndex(index)
												}
											/>
										</g>
									);
								})}

								<line
									x1={plotLeft}
									x2={plotLeft + plotWidth}
									y1={baselineY}
									y2={baselineY}
									stroke={CHART.baseline}
									strokeWidth={1}
								/>
							</svg>

							{active && (
								<ChartTooltip
									left={clampToWidth(
										activeCenter - TOOLTIP_WIDTH / 2,
										TOOLTIP_WIDTH,
										width
									)}
									top={PADDING.top}
									heading={active.label}
									rows={[
										{
											color: seriesColor(0),
											label: valueLabel,
											value: formatValue(active.value),
										},
										...(active.detail ?? []).map((row) => ({
											label: row.label,
											value: row.value,
										})),
									]}
									note={
										active.isPartial
											? 'Período parcial'
											: undefined
									}
								/>
							)}
						</>
					);
				}}
			</ChartPlot>
		</ChartFigure>
	);
};

export default ColumnChart;
