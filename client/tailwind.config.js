/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'netflix-red': '#e50914',
        'deep-space': '#000000',
        'graphite': '#2d2d2d',
        'charcoal': '#414141',
        'slate-border': '#5a5a5a',
        'ash': '#808080',
        'silver': '#b3b3b3',
      },
      backgroundImage: {
        'feature-gradient': 'linear-gradient(149deg, #192247, #210e17)',
      }
    },
  },
  plugins: [],
}

