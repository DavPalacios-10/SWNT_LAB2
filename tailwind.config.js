/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c8d8c8',
          300: '#a3beab',
          400: '#7ba085',
          500: '#5c8367',
          600: '#466750',
          700: '#3a5342',
          800: '#314437',
          900: '#2a3a30',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3eedf',
          500: '#b08968',
          800: '#5c4033',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'eco-sm': '0 2px 8px -2px rgba(16, 185, 129, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'eco-md': '0 8px 24px -4px rgba(16, 185, 129, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(16, 185, 129, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
