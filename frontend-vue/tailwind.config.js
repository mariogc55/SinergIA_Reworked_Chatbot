/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sinergia-dark': '#111827',
        'sinergia-blue': '#3B82F6',
        'sinergia-light-blue': '#60A5FA',
      },
    },
  },
  plugins: [],
}