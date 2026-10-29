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
        // Quantus Palette 2025 (Legacy compatibility)
        violet: {
          50: '#F5F3FF',   // Blue Chalk tint
          100: '#ECE7FE',
          200: '#D7CBFE',
          300: '#BCA4FD',
          400: '#A07BFB',
          500: '#834DFB',  // Electric Violet (Primary Brand Accent)
          600: '#6F38E8',
          700: '#5625C7',
          800: '#431B9C',
          900: '#321379',
        },
        turbo: {
          400: '#FFF545',
          500: '#F0E100',  // Turbo (Vivid Yellow Accent)
          600: '#D4C600',
          700: '#B0A400',
        },
        haiti: {
          50: '#F5F3FF',   // Blue Chalk
          100: '#EAE5F7',
          200: '#D0C6EB',
          300: '#A897D8',
          700: '#302252',
          800: '#21163F',
          900: '#18102B',  // Haiti (Deep Dark Purple-Black)
          950: '#0F091F',
        },
        chalk: '#F5F3FF',  // Blue Chalk (Light Background)
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'violet-glow': '0 0 20px -3px rgba(131, 77, 251, 0.35)',
        'turbo-glow': '0 0 15px -2px rgba(240, 225, 0, 0.45)',
        'card-light': '0 2px 10px rgba(24, 16, 43, 0.04), 0 1px 3px rgba(24, 16, 43, 0.02)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}