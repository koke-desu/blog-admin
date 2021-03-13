module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        main1: "#30A9F4",
        main2: "#039BE5",
        accent: "#FFC107",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
