/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ceo-office': '#8B5CF6',
        'commercial': '#3B82F6',
        'operations': '#10B981',
        'technology': '#6366F1',
        'profit': '#F59E0B',
        'people': '#EC4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
