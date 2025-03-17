const defaultColors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      keyframes: {
        'slide-in-and-slide-out': {
          '0%': {transform: 'translateX(-100%)', opacity: 0 },
          '25%,75%': {transform: 'translateX(0%)', opacity: 1 },
          '100%': {transform: 'translateX(100%)', opacity: 0 },
        },
        'slide-in': {
          '0%': {transform: 'translateX(-100%)', opacity: 0 },
          '25%,75%': {transform: 'translateX(-50%)', opacity: 0.5 },
          '100%': {transform: 'translateX(100%)', opacity: 1 },
        }
      },
      animation: {
        'slide-in-and-slide-out': 'slide-in-and-slide-out 5s forwards'
      },
      backgroundImage: {
        'footer-adjacent-pattern': "url('../public/images/about-us-image.svg')",
      },
      minHeight: {
        64: "16rem",
        72: '18rem',
      },
      maxHeight: {
        64: "16rem",
        72: '18rem',
      },
      maxWidth: {
        64: "16rem",
        72: '18rem',
      },
      minWidth: {
        64: "16rem",
        72: '18rem',
      },
      height: {
        "5%": "5%",
      },
      zIndex: {
        60: "60",
        70: "70",
      },
    },
  },
  plugins: [],
};
