const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Audiowide", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "chapel-orange-200": "#ff9b0f",
        "chapel-orange-500": "#ff6118",
        "chapel-yellow-200": "#ffdb04",
        "chapel-purple-500": "#150c66",
        "chapel-pink": "#bb388e",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
