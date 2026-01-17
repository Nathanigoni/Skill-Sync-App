/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e3a8a'
        },
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          500: '#ed8936',
          600: '#dd6b20',
          700: '#c05621',
          800: '#92400e',
          900: '#78350f'
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'smooth': '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}