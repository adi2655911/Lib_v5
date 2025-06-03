/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Important
    './app/**/*.{js,ts,jsx,tsx}', // Also include if `app/` exists
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};