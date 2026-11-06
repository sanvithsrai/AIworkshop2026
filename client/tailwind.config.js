/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        'portal-green': '#10b981',
        'portal-green-hover': '#059669',
        'netflix-red': '#10b981',
        'deep-space': '#000000',
        'graphite': '#1f1f1f',
        'charcoal': '#2e2e2e',
        'slate-border': '#3d3d3d',
        'ash': '#808080',
        'silver': '#b3b3b3',
      },
      backgroundImage: {
        'feature-gradient': 'linear-gradient(149deg, #1f1f1f, #141414)',
      }
    },
  },
  plugins: [],
}
