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
				fucsia: '#EB5480',
				pink: '#FFB1C8',
				gray_text: '#373737',
				icons_bg: '#E4E4E4',
				nav_bg: '#F8F5FF',
				gray_line: '#D7D7D7',
				bg_gradient_1: '#D8B4FE',
				bg_gradient_2: '#FCD5CE',
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
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'fade-out': 'fade-out 0.3s ease-out forwards',
				'slide-in-from-right':
					'slide-in-from-right 0.3s ease-out forwards',
				'slide-out-to-right':
					'slide-out-to-right 0.3s ease-out forwards',
			},
		},
	},
	plugins: [tailwindcssAnimate],
};
