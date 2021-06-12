module.exports = {
  style: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("postcss-100vh-fix"),
        require("autoprefixer"),
      ],
    },
  },
};
