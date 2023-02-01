/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        light: '#F1F1F1',
        primary: '#E86036',
        secondary: '#9A9BA5',
        dark: '#BE4D48',
        darker: '#2D2D3C'
      }
    }
  },
  plugins: []
};
