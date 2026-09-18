/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F3D21',
          light: '#EAF7EF',
          soft: '#F4F9F6',
          beige: '#F9F6E8',
          text: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}
