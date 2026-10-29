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
        // Mediterranean Artisanal Palette (Bespoke Professional Design)
        riviera: {
          50: '#F0F5FA',
          100: '#DFEAF3',
          200: '#C0D5E6',
          300: '#94B7D4',
          400: '#5C90BC',
          500: '#356E9F',
          600: '#23537E',
          700: '#1B3F63',
          800: '#183451', // 01 Riviera Blue
          900: '#11253A',
          950: '#0B1724',
        },
        terracotta: {
          50: '#FDF7F3',
          100: '#FAECE4',
          200: '#F4D6C6',
          300: '#ECB89F',
          400: '#DC8963',
          500: '#C25E24',
          600: '#A9501C', // 02 Terracotta
          700: '#8E3F14',
          800: '#753413',
          900: '#602B13',
          950: '#361508',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F6F1E7',
          300: '#F3ECDE', // 03 Soft Ivory
          400: '#E7DCBE',
          500: '#DAC7A3',
          600: '#C5AD85',
          700: '#A38B65',
          800: '#7F6B4E',
          900: '#64543E',
        },
        sand: {
          50: '#FAF6F0',
          100: '#F4ECDF',
          200: '#EBDDC6',
          300: '#DFC8A5',
          400: '#D4AF83', // 04 Sand Linen
          500: '#BA9260',
          600: '#9E7849',
          700: '#7F5F39',
          800: '#674D30',
          900: '#553F28',
        },

        primary: {
          DEFAULT: '#183451',
          dark: '#11253A',
          hover: '#1B3F63',
          light: '#F3ECDE',
          accent: '#A9501C',
        },
        // Universal token mapping to cascade the Mediterranean palette everywhere
        violet: {
          50: '#FAF7F2',   // Soft Ivory background
          100: '#F3ECDE',  // Soft Ivory tint
          200: '#EBDDC6',  // Sand Linen subtle border
          300: '#D4AF83',  // Sand Linen
          400: '#DC8963',  // Warm Terracotta tint
          500: '#183451',  // Riviera Blue
          600: '#A9501C',  // Terracotta accent
          700: '#8E3F14',  // Terracotta dark
          800: '#183451',  // Riviera Blue dark
          900: '#11253A',  // Riviera deep
          950: '#0B1623',  // Riviera night
        },
        turbo: {
          400: '#DFC8A5',
          500: '#A9501C',  // Terracotta accent
          600: '#8E3F14',
          700: '#753413',
        },
        haiti: {
          50: '#FAF7F2',   // Soft Ivory
          100: '#F3ECDE',
          200: '#EBDDC6',
          300: '#D4AF83',  // Sand Linen
          700: '#1B3F63',
          800: '#183451',  // Riviera Blue
          900: '#11253A',  // Riviera deep
          950: '#0B1623',  // Riviera night
        },
        chalk: '#FAF7F2',  // Soft Ivory
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'riviera-glow': '0 0 20px -3px rgba(24, 52, 81, 0.25)',
        'terracotta-glow': '0 0 15px -2px rgba(169, 80, 28, 0.35)',
        'violet-glow': '0 0 20px -3px rgba(24, 52, 81, 0.25)',
        'turbo-glow': '0 0 15px -2px rgba(169, 80, 28, 0.35)',
        'card-light': '0 1px 3px rgba(24, 52, 81, 0.04), 0 4px 12px rgba(24, 52, 81, 0.03)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}