/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4a5568',
        'secondary': '#718096',
        'accent': '#f6ad55',
      },
    },
  },
  plugins: [],
}