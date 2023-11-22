/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				blue: {
					50: '#eaf2f7',
					100: '#d5e6ef',
					200: '#abcde0',
					300: '#81b3d0',
					400: '#579ac1',
					500: '#2d81b1',
					600: '#24678e',
					700: '#1b4d6a',
					800: '#123447',
					900: '#091a23'
				}
			}
		}
	},
	plugins: []
};
