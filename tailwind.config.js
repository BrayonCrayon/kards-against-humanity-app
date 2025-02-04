const defaultColors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
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
      colors: {
        lightBlack: "#1a1a1a",
        lukewarmGray: {
          50: "#f8f8f8",
          100: "#f0f0f0",
          200: "#e4e4e4",
          300: "#d3d3d3",
          400: "#b4b4b4",
          500: "#9a9a9a",
          600: "#818181",
          700: "#6a6a6a",
          800: "#5a5a5a",
          900: "#4e4e4e",
        },
        emerald: {
          ...defaultColors.emerald,
          500: "#95D860",
        },
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
