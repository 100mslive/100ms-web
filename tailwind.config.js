module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        sm: "0px 11px 26px rgba(0, 0, 0, 0.2)",
        DEFAULT: "0px 2px 9px rgba(0, 0, 0, 0.18)",
      },
      transitionProperty: {
        height: "height",
      },
      width: {
        "8/10": "80%",
        "2/10": "20%",
      },
      padding: {
        2.5: "10px",
      },
      textColor: "#FFFFFF",
      colors: {
        blue: {
          tint: "#74AAFF",
          main: "#2F80FF",
          shade: "#0B326F",
        },
        red: {
          tint: "#E66977",
          main: "#D74451",
          shade: "#6F2229",
        },
        gray: {
          100: "#212121",
          200: "#3B3B3B",
          300: "#5E5E5E",
          400: "#8E8E8E",
          500: "#C7C7C7",
        },
        transparent: {
          standard: "rgba(0, 0, 0, 0)",
          light: "rgba(255, 255, 255, 0.25)",
          dark: "rgba(0, 0, 0, 0.75)",
          disabled: "rgba(59, 59, 59, 0.3)",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
