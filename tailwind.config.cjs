/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#10101a', surface: '#171722', panel: '#211d2c',
        primary: '#ae91ff', lavender: '#cc9dff', muted: '#a99db9'
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Outfit', 'sans-serif'] },
    },
  },
  plugins: [],
};
