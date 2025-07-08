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
			},
			keyframes: {
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
