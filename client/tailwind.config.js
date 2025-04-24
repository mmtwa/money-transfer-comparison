/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter','Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeInDown: {
          '0%': { 
            transform: 'translateY(-10px) scale(0.95)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
        },
        rotateDown: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        rotateUp: {
          '0%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '60%': { transform: 'scale(2)', opacity: '0.3' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        }
      },
      animation: {
        shimmer: 'shimmer 1s linear forwards',
        fadeInDown: 'fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        rotateDown: 'rotateDown 0.3s ease-in-out forwards',
        rotateUp: 'rotateUp 0.3s ease-in-out forwards',
        ripple: 'ripple 0.6s linear',
      },
    },
  },
  plugins: [],
}