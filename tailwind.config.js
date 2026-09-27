/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        risk: {
          high: '#dc2626',
          medium: '#f59e0b',
          low: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}
