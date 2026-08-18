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
        // Quantus Palette 2025
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