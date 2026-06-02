/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        black: '#0A0A0A',
        white: '#F5F5F0',
        gray: {
          950: '#0D0D0D',
          900: '#141414',
          800: '#1C1C1C',
          700: '#2A2A2A',
          600: '#3D3D3D',
          500: '#5C5C5C',
          400: '#8C8C8C',
          300: '#ADADAD',
          200: '#CFCFCF',
          100: '#E8E8E8',
        },
        accent: '#C8B89A',
        silver: '#A8A89E',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}