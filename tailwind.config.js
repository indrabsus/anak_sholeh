/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Brand Identity Colors from Slide 5
        brand: {
          dark: '#0B5E38',
          DEFAULT: '#0E7A49', // Hijau Islami (Ketenteraman, keberkahan)
          light: '#7ED957',   // Hijau Muda (Pertumbuhan, harapan)
          gold: '#F4B63F',    // Emas (Prestasi, kemuliaan)
          blue: '#2D9CDB',    // Biru Langit (Kepercayaan, masa depan)
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7cf',
          300: '#86efad',
          400: '#7ED957',
          500: '#0E7A49',
          600: '#0c6a3f',
          700: '#0a5633',
          800: '#084529',
          900: '#063620',
          950: '#032013',
        },
      },
    },
  },
  plugins: [],
}
