/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#08152E',
        deepblue: '#142B50',
        ember: '#D71932',
        inferno: '#FF641C',
        molten: '#FF8A00',
        amber: '#FFB21C',
        golden: '#FFD166',
        ivory: '#F8F3E9',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
