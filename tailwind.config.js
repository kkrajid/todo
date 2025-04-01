/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        barAnimation: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        }
      },
      animation: {
        'bar1': 'barAnimation 1.2s ease-in-out infinite',
        'bar2': 'barAnimation 1.2s ease-in-out infinite 0.2s',
        'bar3': 'barAnimation 1.2s ease-in-out infinite 0.4s',
        'bar4': 'barAnimation 1.2s ease-in-out infinite 0.6s',
        'bar5': 'barAnimation 1.2s ease-in-out infinite 0.8s',
      }
    }
  },
  plugins: [],
}