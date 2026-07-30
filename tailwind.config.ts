import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				aromas_fucsia: '#EB5480',
				aromas_pink: '#FFB1C8',
				aromas_gray_text: '#373737',
				aromas_icons_bg: '#E4E4E4',
				aromas_nav_bg: '#F8F5FF',
				aromas_gray_line: '#D7D7D7',
				aromas_bg_gradient_1: '#D8B4FE',
				aromas_bg_gradient_2: '#FCD5CE',
				aromas_header_bg_gradient_1: '#FCD5CE',
				aromas_home_bg: '#F8F5FF',
				aromas_success: '#166534',

				/*
				 * Accessible ink steps. `aromas_fucsia` (#EB5480) only reaches
				 * 3.44:1 on white, so it cannot carry text or icons on its own;
				 * these are the same hue stepped down until they clear WCAG AA.
				 * Ratios measured against #FFFFFF.
				 */
				aromas_fucsia_ink: '#A51D44' /* 7.35:1 — text, borders, focus */,
				aromas_ink: '#1F1F1F' /* 15.9:1 — headings, values */,
				aromas_ink_muted: '#5B5A56' /* 6.90:1 — captions, axis text */,
				aromas_ink_axis: '#575652' /* 7.35:1 — chart tick labels */,
				aromas_hairline: '#DEDCD5' /* decorative gridlines only */,

				/*
				 * Status *text*. The chart status fills (warning #FAB219 at
				 * 1.83:1, serious #EC835A at 2.64:1) are deliberately below
				 * 3:1 and are always paired with an icon and a label — these
				 * are the steps that pairing is written in.
				 */
				aromas_warning_ink: '#8A5300' /* 6.33:1 */,
				aromas_critical_ink: '#A10F0F' /* 8.11:1 */,
			},
			keyframes: {
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px) scale(.95)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)',
					},
				},
				'scale-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)',
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(8px) scale(.95)',
					},
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				'slide-in-from-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'slide-out-to-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'slide-in-from-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'slide-out-to-left': {
					'0%': { transform: 'translateX(0)', opacity: '1' },
					'100%': { transform: 'translateX(-100%)', opacity: '0' },
				},
			},
			animation: {
				'scale-in': 'scale-in .25s ease-out forwards',
				'scale-out': 'scale-out .2s ease-in forwards',
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'fade-out': 'fade-out 0.3s ease-out forwards',
				'slide-in-from-right':
					'slide-in-from-right 0.3s ease-out forwards',
				'slide-out-to-right':
					'slide-out-to-right 0.3s ease-out forwards',
				'slide-in-from-left':
					'slide-in-from-left 0.3s ease-out forwards',
				'slide-out-to-left': 'slide-out-to-left 0.3s ease-out forwards',
			},
		},
	},
	plugins: [tailwindcssAnimate],
};
