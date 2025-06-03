/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      colors: {
        heading: '#7c3aed',
        text: '#1e293b',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};