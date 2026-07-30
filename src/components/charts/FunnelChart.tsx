import { useMemo } from 'react';
import ChartFigure from './ChartFigure';
import ChartPlot from './ChartPlot';
import { useChartCursor } from './chart-hooks';
import {
	AXIS_FONT_SIZE,
	CHART,
	LABEL_FONT_SIZE,
	ordinalStep,
	textureClass,
} from './chart-tokens';
import { approxTextWidth } from './chart-scale';

export interface IFunnelStage {
	key: string;
	label: string;
	value: number;
	/** Shown under the stage, e.g. what the number counts. */
	note?: string;
}

interface FunnelChartProps {
	title: string;
	description?: string;
	footnote?: string;
	stages: IFunnelStage[];
	formatValue: (value: number) => string;
	summary: string;
	/** Name of the thing being counted at each stage, for the table header. */
	valueLabel: string;
	isStale?: boolean;
}

const ROW_HEIGHT = 52;
const BAR_HEIGHT = 30;
const LABEL_WIDTH = 150;

/**
 * Ordered stages, widest first, each with the step-to-step drop beside it.
 *
 * Stages are an ordered category, so they take the validated ordinal ramp
 * rather than eight categorical hues — the darkening *is* the ordering. Every
 * stage carries its own value label, so the widths never have to be compared by
 * eye, and the drop between stages is stated rather than inferred.
 */
const FunnelChart = ({
	title,
	description,
	footnote,
	stages,
	formatValue,
	summary,
	valueLabel,
	isStale = false,
}: FunnelChartProps) => {
	const stepRate = (index: number): number | null => {
		if (index === 0) return null;
		const previous = stages[index - 1].value;
		if (previous <= 0) return null;
		return (stages[index].value / previous) * 100;
	};

	const cursor = useChartCursor(stages.length, (index) => {
		const rate = stepRate(index);
		return [
			`${stages[index].label}: ${formatValue(stages[index].value)}`,
			rate === null
				? ''
				: `${rate.toFixed(1)}% de ${stages[index - 1].label}`,
			stages[index].note ?? '',
		]
			.filter(Boolean)
			.join('. ');
	});

	const table = useMemo(
		() => ({
			columns: ['Etapa', valueLabel, 'Respecto de la etapa anterior'],
			rows: stages.map((stage, index) => {
				const previous = index === 0 ? 0 : stages[index - 1].value;
				return [
					stage.label,
					formatValue(stage.value),
					index === 0 || previous <= 0
						? '—'
						: `${((stage.value / previous) * 100).toFixed(1)}%`,
				];
			}),
		}),
		[stages, formatValue, valueLabel]
	);

	const maxValue = Math.max(1, ...stages.map((stage) => stage.value));
	const height = stages.length * ROW_HEIGHT;

	return (
		<ChartFigure
			title={title}
			description={description}
			footnote={footnote}
			table={table}
			/*
			 * All-zero stages would draw a row of 2px stubs, which reads as a
			 * rendering fault rather than as "nothing happened yet".
			 */
			isEmpty={
				stages.length === 0 ||
				stages.every((stage) => stage.value === 0)
			}
			emptyMessage='Todavía no hay eventos acumulados.'
			isStale={isStale}>
			<ChartPlot label={summary} height={height} cursor={cursor}>
				{(width) => {
					const labelWidth = Math.min(
						LABEL_WIDTH,
						Math.max(96, Math.round(width * 0.3))
					);
					const trackLeft = labelWidth + 10;
					const trackWidth = Math.max(40, width - trackLeft - 8);
					const maxChars = Math.max(
						8,
						Math.floor(labelWidth / (AXIS_FONT_SIZE * 0.56))
					);

					return (
						<svg
							aria-hidden='true'
							focusable='false'
							width={width}
							height={height}
							className='block'>
							{stages.map((stage, index) => {
								const step = ordinalStep(index, stages.length);
								const rowTop = index * ROW_HEIGHT;
								const barWidth = Math.max(
									2,
									(stage.value / maxValue) * trackWidth
								);
								const rate = stepRate(index);
								const isActive = cursor.index === index;
								const valueText = formatValue(stage.value);
								const labelFits =
									approxTextWidth(
										valueText,
										LABEL_FONT_SIZE
									) +
										16 <=
									barWidth;
								const shortLabel =
									stage.label.length > maxChars
										? `${stage.label.slice(0, maxChars - 1)}…`
										: stage.label;

								return (
									<g key={stage.key}>
										{isActive && (
											<rect
												x={0}
												y={rowTop}
												width={width}
												height={ROW_HEIGHT}
												rx={4}
												fill={CHART.ink}
												opacity={0.06}
											/>
										)}
										<text
											x={labelWidth}
											y={rowTop + BAR_HEIGHT / 2 + 5}
											textAnchor='end'
											fontSize={AXIS_FONT_SIZE}
											fill={CHART.inkAxis}>
											{shortLabel}
										</text>
										<rect
											x={trackLeft}
											y={rowTop + 4}
											width={barWidth}
											height={BAR_HEIGHT}
											rx={4}
											fill={step.fill}
											className={textureClass(index)}
										/>
										{/*
										 * The value sits inside the bar when it
										 * fits with padding on both sides, in
										 * the ink paired with that ramp step;
										 * otherwise it moves outside the end.
										 * It is never clipped by its own mark.
										 */}
										<text
											x={
												labelFits
													? trackLeft + 8
													: trackLeft + barWidth + 8
											}
											y={rowTop + BAR_HEIGHT / 2 + 5}
											fontSize={LABEL_FONT_SIZE}
											fontWeight={600}
											fill={
												labelFits
													? step.onFill
													: CHART.ink
											}
											className='tabular-nums'>
											{valueText}
										</text>
										{rate !== null && (
											<text
												x={trackLeft}
												y={rowTop + ROW_HEIGHT - 5}
												fontSize={AXIS_FONT_SIZE}
												fill={CHART.inkSecondary}>
												{`${rate.toFixed(1)}% de ${stages[index - 1].label}`}
											</text>
										)}
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
					);
				}}
			</ChartPlot>
		</ChartFigure>
	);
};

export default FunnelChart;
