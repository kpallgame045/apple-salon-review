/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5EFEB',
          300: '#EFE7E0',
          400: '#E4D9CF',
        },
        cream: {
          DEFAULT: '#F7F3EE',
          warm: '#FBF9F6',
          card: '#FFFFFF',
          border: '#E8DFD5',
        },
        blush: {
          50: '#FDF8F7',
          100: '#FAECE9',
          200: '#F3D6CF',
          300: '#E6B6AB',
          400: '#D58F82',
          500: '#C16A5B',
          600: '#A45041',
        },
        charcoal: {
          50: '#F5F6F6',
          100: '#E5E7E7',
          200: '#C8CDCC',
          300: '#9EA6A4',
          400: '#6C7573',
          500: '#4D5553',
          600: '#3A413F',
          700: '#2C3230',
          800: '#202523',
          900: '#151817',
          DEFAULT: '#1D2220',
        },
        gold: {
          subtle: '#D6C09C',
          accent: '#B89B6C',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(33, 27, 24, 0.05)',
        'elevated': '0 12px 36px -4px rgba(33, 27, 24, 0.08), 0 4px 12px -2px rgba(33, 27, 24, 0.03)',
        'glow': '0 0 25px rgba(213, 143, 130, 0.18)',
      }
    },
  },
  plugins: [],
}
