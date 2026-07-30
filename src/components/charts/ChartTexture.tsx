/**
 * The backup identity channel.
 *
 * Under a forced-colours theme or on a grayscale print, hue carries nothing:
 * the categorical fills all collapse to the same ink. These four hatches are
 * referenced by the `.viz-fill-*` classes in index.css, which only point at
 * them inside `forced-colors` and `print` media — never by default, because a
 * dense angled field is noise (and a vestibular risk) when colour already works.
 *
 * Rendered once per page: SVG fragment references resolve against the whole
 * document, so every chart can point at the same four pattern ids. Only 45 and
 * its 135 mirror are used — horizontal or vertical hatching reads as gridlines.
 */
const ChartTextureDefs = () => (
	<svg
		aria-hidden='true'
		focusable='false'
		width='0'
		height='0'
		className='absolute h-0 w-0 overflow-hidden'>
		<defs>
			<pattern
				id='viz-texture-a'
				width='6'
				height='6'
				patternUnits='userSpaceOnUse'
				patternTransform='rotate(45)'>
				<rect width='6' height='6' fill='Canvas' />
				<line
					x1='0'
					y1='0'
					x2='0'
					y2='6'
					stroke='CanvasText'
					strokeWidth='2'
				/>
			</pattern>
			<pattern
				id='viz-texture-b'
				width='6'
				height='6'
				patternUnits='userSpaceOnUse'
				patternTransform='rotate(135)'>
				<rect width='6' height='6' fill='Canvas' />
				<line
					x1='0'
					y1='0'
					x2='0'
					y2='6'
					stroke='CanvasText'
					strokeWidth='2'
				/>
			</pattern>
			<pattern
				id='viz-texture-c'
				width='3'
				height='3'
				patternUnits='userSpaceOnUse'
				patternTransform='rotate(45)'>
				<rect width='3' height='3' fill='Canvas' />
				<line
					x1='0'
					y1='0'
					x2='0'
					y2='3'
					stroke='CanvasText'
					strokeWidth='1.5'
				/>
			</pattern>
			<pattern
				id='viz-texture-d'
				width='3'
				height='3'
				patternUnits='userSpaceOnUse'
				patternTransform='rotate(135)'>
				<rect width='3' height='3' fill='Canvas' />
				<line
					x1='0'
					y1='0'
					x2='0'
					y2='3'
					stroke='CanvasText'
					strokeWidth='1.5'
				/>
			</pattern>
		</defs>
	</svg>
);

export default ChartTextureDefs;
