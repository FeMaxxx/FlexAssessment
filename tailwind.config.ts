import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          50: '#eefafe',
          100: '#def5fd',
          200: '#b7e8fb',
          300: '#7fd7f8',
          400: '#41c1f3',
          500: '#0ea5e9',
          600: '#0286c7',
          700: '#036797',
          800: '#07557a',
          900: '#0a4764'
        }
      }
    },
  },
  plugins: [],
}
export default config
