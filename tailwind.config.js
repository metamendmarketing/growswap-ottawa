/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f9f4',
          100: '#e1f2e6',
          200: '#c4e5cf',
          300: '#97d1ac',
          400: '#64b684',
          500: '#3e9962',
          600: '#2e7c4d',
          700: '#26633f',
          800: '#224f34',
          900: '#1d422d',
          950: '#0b2417',
        },
        earth: {
          50: '#faf6f0',
          100: '#f3ece0',
          200: '#e6d8c0',
          300: '#d5be9b',
          400: '#c2a176',
          500: '#b48a5b',
          600: '#a3744e',
          700: '#885c41',
          800: '#704c3a',
          900: '#5c3f32',
        },
        harvest: {
          amber: '#f59e0b',
          orange: '#ea580c',
          tomato: '#dc2626',
          leaf: '#16a34a',
          sunflower: '#eab308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
