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
import { approxTextWidth, barPath, clampToWidth, niceMax } from './chart-scale';

export interface IRankedItem {
	key: string;
	label: string;
	value: number;
	/** Second measure, shown in the tooltip and the table but never plotted. */
	secondary?: { label: string; value: string };
}

interface RankedBarChartProps {
	title: string;
	description?: string;
	footnote?: string;
	items: IRankedItem[];
	valueLabel: string;
	categoryLabel: string;
	formatValue: (value: number) => string;
	formatTick?: (value: number) => string;
	summary: string;
	/** Rows drawn as bars. The rest stay in the table twin. */
	maxRows?: number;
	isStale?: boolean;
	emptyMessage?: string;
}

const ROW_HEIGHT = 28;
const PADDING = { top: 6, right: 8, bottom: 6 };
const LABEL_MIN = 88;
const LABEL_MAX = 190;

/**
 * Ranked categories, plotted horizontally so long product names read straight.
 *
 * Nominal categories all take slot 1: shading each bar darker-where-bigger
 * would double-encode the length as hue and burn the only free channel on
 * information the bar already shows.
 */
const RankedBarChart = ({
	title,
	description,
	footnote,
	items,
	valueLabel,
	categoryLabel,
	formatValue,
	formatTick,
	summary,
	maxRows = 8,
	isStale = false,
	emptyMessage,
}: RankedBarChartProps) => {
	const tickFormatter = formatTick ?? formatValue;
	const plotted = useMemo(() => items.slice(0, maxRows), [items, maxRows]);

	const cursor = useChartCursor(plotted.length, (index) => {
		const item = plotted[index];
		return [
			`${item.label}: ${formatValue(item.value)}`,
			item.secondary
				? `${item.secondary.label}: ${item.secondary.value}`
				: '',
		]
			.filter(Boolean)
			.join('. ');
	});

	const table = useMemo(() => {
		const secondaryLabel = items.find((item) => item.secondary)?.secondary
			?.label;
		return {
			columns: [
				categoryLabel,
				valueLabel,
				...(secondaryLabel ? [secondaryLabel] : []),
			],
			rows: items.map((item) => [
				item.label,
				formatValue(item.value),
				...(secondaryLabel ? [item.secondary?.value ?? '—'] : []),
			]),
		};
	}, [items, categoryLabel, valueLabel, formatValue]);

	const maxValue = niceMax(Math.max(0, ...plotted.map((item) => item.value)));
	const height = PADDING.top + PADDING.bottom + plotted.length * ROW_HEIGHT;
	const valueWidth =
		approxTextWidth(tickFormatter(maxValue), LABEL_FONT_SIZE) + 12;

	return (
		<ChartFigure
			title={title}
			description={description}
			footnote={
				items.length > plotted.length
					? [
							footnote,
							`Se grafican los ${plotted.length} primeros; la tabla de datos incluye los ${items.length}.`,
						]
							.filter(Boolean)
							.join(' ')
					: footnote
			}
			table={table}
			isEmpty={items.length === 0}
			emptyMessage={emptyMessage}
			isStale={isStale}>
			<ChartPlot
				label={summary}
				height={Math.max(height, ROW_HEIGHT)}
				cursor={cursor}>
				{(width) => {
					const labelWidth = Math.min(
						LABEL_MAX,
						Math.max(LABEL_MIN, Math.round(width * 0.34))
					);
					const trackLeft = labelWidth + 10;
					const trackWidth = Math.max(
						24,
						width - trackLeft - PADDING.right - valueWidth
					);
					const maxChars = Math.max(
						6,
						Math.floor(labelWidth / (AXIS_FONT_SIZE * 0.56))
					);
					const thickness = Math.min(
						MARK.maxBarThickness,
						ROW_HEIGHT - 10
					);

					return (
						<>
							<svg
								aria-hidden='true'
								focusable='false'
								width={width}
								height={height}
								className='block'>
								{plotted.map((item, index) => {
									const rowTop =
										PADDING.top + index * ROW_HEIGHT;
									const centerY = rowTop + ROW_HEIGHT / 2;
									const barWidth =
										maxValue === 0
											? 0
											: (item.value / maxValue) *
												trackWidth;
									const isActive = cursor.index === index;
									const shortLabel =
										item.label.length > maxChars
											? `${item.label.slice(0, maxChars - 1)}…`
											: item.label;

									return (
										<g key={item.key}>
											{isActive && (
												<rect
													x={0}
													y={rowTop}
													width={width}
													height={ROW_HEIGHT}
													fill={CHART.ink}
													opacity={0.06}
													rx={4}
												/>
											)}
											<text
												x={labelWidth}
												y={centerY + 4}
												textAnchor='end'
												fontSize={AXIS_FONT_SIZE}
												fill={CHART.inkAxis}>
												{shortLabel}
											</text>
											{/* The track shows how far the bar
											    falls short of the leader. */}
											<rect
												x={trackLeft}
												y={centerY - thickness / 2}
												width={trackWidth}
												height={thickness}
												rx={MARK.barRadius}
												fill={CHART.ink}
												opacity={0.05}
											/>
											<path
												d={barPath(
													trackLeft,
													centerY - thickness / 2,
													barWidth,
													thickness,
													MARK.barRadius,
													'right'
												)}
												fill={seriesColor(0)}
												className={textureClass(0)}
											/>
											<text
												x={trackLeft + trackWidth + 8}
												y={centerY + 4}
												fontSize={LABEL_FONT_SIZE}
												fontWeight={600}
												fill={CHART.ink}
												className='tabular-nums'>
												{tickFormatter(item.value)}
											</text>
											<rect
												x={0}
												y={rowTop}
												width={width}
												height={ROW_HEIGHT}
												fill='transparent'
												onPointerEnter={() =>
													cursor.setIndex(index)
												}
											/>
										</g>
									);
								})}
							</svg>

							{cursor.index !== null &&
								(() => {
									const item = plotted[cursor.index];
									const secondary = item.secondary;
									return (
										<ChartTooltip
											left={clampToWidth(
												trackLeft,
												TOOLTIP_WIDTH,
												width
											)}
											top={Math.max(
												0,
												PADDING.top +
													(cursor.index ?? 0) *
														ROW_HEIGHT -
													(secondary ? 76 : 58)
											)}
											heading={item.label}
											rows={[
												{
													color: seriesColor(0),
													label: valueLabel,
													value: formatValue(
														item.value
													),
												},
												...(secondary
													? [
															{
																label: secondary.label,
																value: secondary.value,
															},
														]
													: []),
											]}
										/>
									);
								})()}
						</>
					);
				}}
			</ChartPlot>
		</ChartFigure>
	);
};

export default RankedBarChart;
