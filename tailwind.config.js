/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          50: "#F9F9F9",
          100: "#CCCCCC",
          200: "#808080",
          300: "#404040",
          400: "#2D2D2D",
          500: "#1A1A1A",
        },
        blue: {
          light: "#66A3FF",
          DEFAULT: "#0066FF",
          dark: "#3385FF", // User listed 3385FF as an accent, I'll name it blue-accent or similar
          accent: "#3385FF",
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'sm': '2px',
        DEFAULT: '4px',
        'md': '4px', // No rounded corners beyond 4px
        'lg': '4px',
        'xl': '4px',
        'full': '4px', 
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      }
    },
  },
  plugins: [],
}
