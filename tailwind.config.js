/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        'terminal-bg': '#0f0f0f',
        'terminal-green': '#06d6a0',
      },
      animation: {
        'blink': 'blink 1s step-start infinite',
      },
      keyframes: {
        blink: {
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}