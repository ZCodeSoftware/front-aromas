import { useMemo } from 'react';
import ChartFigure from './ChartFigure';
import ChartLegend from './ChartLegend';
import ChartPlot from './ChartPlot';
import ChartTooltip, { TOOLTIP_WIDTH } from './ChartTooltip';
import { useChartCursor } from './chart-hooks';
import {
	CHART,
	LABEL_FONT_SIZE,
	MARK,
	seriesColor,
	textureClass,
} from './chart-tokens';
import { approxTextWidth, clampToWidth } from './chart-scale';

export interface IShareSegment {
	key: string;
	label: string;
	value: number;
}

interface ShareBarProps {
	title: string;
	description?: string;
	footnote?: string;
	segments: IShareSegment[];
	valueLabel: string;
	categoryLabel: string;
	formatValue: (value: number) => string;
	summary: string;
	/** Segments past this count fold into "Otros"; the table keeps them all. */
	maxSegments?: number;
	isStale?: boolean;
	emptyMessage?: string;
}

const BAR_HEIGHT = 44;
/** Band under the bar where the share labels sit, on the surface. */
const LABEL_BAND = 20;
const PLOT_HEIGHT = BAR_HEIGHT + LABEL_BAND;
const formatShare = (share: number): string => `${share.toFixed(1)}%`;

/**
 * Part-to-whole as one stacked bar rather than a pie: a bar keeps every segment
 * on a shared baseline, so close values stay comparable and the labels have
 * somewhere to sit. Segments are separated by a 2px gap in the surface colour,
 * never by a stroke around each fill.
 *
 * Share labels sit *under* the bar rather than inside the fills. No single ink
 * clears 4.5:1 against all eight categorical hues — slot-1 blue reaches only
 * 4.42:1 with white and 3.73:1 with near-black — so an in-fill label could not
 * be made to pass on every segment. On the surface it always does.
 */
const ShareBar = ({
	title,
	description,
	footnote,
	segments,
	valueLabel,
	categoryLabel,
	formatValue,
	summary,
	maxSegments = 6,
	isStale = false,
	emptyMessage,
}: ShareBarProps) => {
	/*
	 * Colour follows the entity, not its rank.
	 *
	 * The bar is drawn largest-first because that is easier to read, but the hue
	 * is looked up from the segment's position in the *input* order — which for
	 * these endpoints is a stable server order. Keying off the sorted position
	 * instead would repaint every segment the month two of them swap places,
	 * and a reader who learned "efectivo is orange" would be misled.
	 */
	const colorIndexByKey = useMemo(() => {
		const map = new Map<string, number>();
		segments.forEach((segment, index) => map.set(segment.key, index));
		return map;
	}, [segments]);

	const ordered = useMemo(
		() => [...segments].sort((a, b) => b.value - a.value),
		[segments]
	);

	/*
	 * Never generate a ninth hue: the tail folds into a single de-emphasised
	 * "Otros" segment, and the table twin still lists every original row.
	 */
	const plotted = useMemo<IShareSegment[]>(() => {
		if (ordered.length <= maxSegments) return ordered;
		const head = ordered.slice(0, maxSegments - 1);
		const tail = ordered.slice(maxSegments - 1);
		return [
			...head,
			{
				key: '__otros__',
				label: `Otros (${tail.length})`,
				value: tail.reduce((sum, item) => sum + item.value, 0),
			},
		];
	}, [ordered, maxSegments]);

	const total = plotted.reduce((sum, item) => sum + item.value, 0);
	const shareOf = (value: number) => (total === 0 ? 0 : (value / total) * 100);
	const colorOf = (index: number) => {
		const segment = plotted[index];
		if (segment.key === '__otros__') return CHART.deemphasis;
		return seriesColor(colorIndexByKey.get(segment.key) ?? index);
	};

	const cursor = useChartCursor(plotted.length, (index) => {
		const segment = plotted[index];
		return `${segment.label}: ${formatValue(segment.value)}, ${formatShare(
			shareOf(segment.value)
		)} del total`;
	});

	const table = useMemo(
		() => ({
			columns: [categoryLabel, valueLabel, 'Participación'],
			rows: ordered.map((segment) => [
				segment.label,
				formatValue(segment.value),
				formatShare(
					total === 0 ? 0 : (segment.value / total) * 100
				),
			]),
		}),
		[ordered, categoryLabel, valueLabel, formatValue, total]
	);

	return (
		<ChartFigure
			title={title}
			description={description}
			footnote={footnote}
			table={table}
			isEmpty={segments.length === 0 || total === 0}
			emptyMessage={emptyMessage}
			isStale={isStale}
			legend={
				<ChartLegend
					items={plotted.map((segment, index) => ({
						label: segment.label,
						color: colorOf(index),
						value: `${formatValue(segment.value)} · ${formatShare(
							shareOf(segment.value)
						)}`,
						textureIndex:
							colorIndexByKey.get(segment.key) ?? index,
					}))}
				/>
			}>
			<ChartPlot label={summary} height={PLOT_HEIGHT} cursor={cursor}>
				{(width) => {
					let offset = 0;
					const geometry = plotted.map((segment, index) => {
						const raw =
							total === 0 ? 0 : (segment.value / total) * width;
						const x = offset;
						offset += raw;
						return {
							segment,
							index,
							x,
							// The gap is taken off the fill, not added around it.
							width: Math.max(
								0,
								raw -
									(index < plotted.length - 1
										? MARK.surfaceGap
										: 0)
							),
						};
					});

					return (
						<>
							<svg
								aria-hidden='true'
								focusable='false'
								width={width}
								height={PLOT_HEIGHT}
								className='block'>
								{geometry.map(
									({ segment, index, x, width: w }) => {
										const shareText = formatShare(
											shareOf(segment.value)
										);
										const fits =
											approxTextWidth(
												shareText,
												LABEL_FONT_SIZE
											) +
												8 <=
											w;
										const isActive = cursor.index === index;

										return (
											<g key={segment.key}>
												<rect
													x={x}
													y={0}
													width={w}
													height={BAR_HEIGHT}
													rx={4}
													fill={colorOf(index)}
													className={textureClass(
														colorIndexByKey.get(
															segment.key
														) ?? index
													)}
													opacity={
														isActive ? 0.82 : 1
													}
												/>
												{fits && (
													<text
														x={x + w / 2}
														y={BAR_HEIGHT + 14}
														textAnchor='middle'
														fontSize={
															LABEL_FONT_SIZE
														}
														fontWeight={600}
														fill={CHART.ink}
														className='tabular-nums'>
														{shareText}
													</text>
												)}
												<rect
													x={x}
													y={0}
													width={Math.max(
														w,
														MARK.minHitTarget
													)}
													height={PLOT_HEIGHT}
													fill='transparent'
													onPointerEnter={() =>
														cursor.setIndex(index)
													}
												/>
											</g>
										);
									}
								)}
							</svg>

							{cursor.index !== null && (
								<ChartTooltip
									left={clampToWidth(
										geometry[cursor.index].x,
										TOOLTIP_WIDTH,
										width
									)}
									top={PLOT_HEIGHT + 4}
									heading={plotted[cursor.index].label}
									rows={[
										{
											color: colorOf(cursor.index),
											label: valueLabel,
											value: formatValue(
												plotted[cursor.index].value
											),
										},
										{
											label: 'del total',
											value: formatShare(
												shareOf(
													plotted[cursor.index].value
												)
											),
										},
									]}
								/>
							)}
						</>
					);
				}}
			</ChartPlot>
		</ChartFigure>
	);
};

export default ShareBar;
