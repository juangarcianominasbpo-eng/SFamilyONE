
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED', // morado vibrante
        secondary: '#06B6D4', // cian
        accent: '#F59E0B' // ámbar
      }
    }
  },
  plugins: []
}
