/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        customRed: 'rgb(197, 21, 27)', // RGB without alpha
        customblue: 'rgba(46,48,147,255)' // RGB without alpha
      },
    },
  },
  plugins: [],
};
