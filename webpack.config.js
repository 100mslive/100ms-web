const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  context: path.resolve(__dirname, "src"),
  entry: "./index.js", // starting point - all dependent files/dependencies will be linked from here
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "static/js/[name].[chunkhash:8].js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    publicPath: "/",
    clean: true,
    /**
     * This is to show the source files in static/js folder instead of webpack://
     * @param {*} info
     * @returns
     */
    devtoolModuleFilenameTemplate: info => {
      return path
        .relative(path.resolve(__dirname, "src"), info.absoluteResourcePath)
        .replace(/\\/g, "/");
    },
  },
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  performance: false,
  target: "web",
  resolve: {
    extensions: [".js", ".jsx", ".css", ".svg"],
    fallback: {
      path: false,
      fs: false,
      events: false,
    },
  },
  ignoreWarnings: [/Failed to parse source map/], // some libraries do not provide proper source maps which throws this warning
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "jsx",
              target: "es6",
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"], // This order is to be maintained
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: "asset/resource", // This will be outputted as a separate file
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: "asset/inline", // These will be embedded in html itself.
      },
    ],
  },
  optimization: {
    splitChunks: {},
    runtimeChunk: false,
    minimize: process.env.NODE_ENV === "production",
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.esbuildMinify,
      }),
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new ESLintPlugin({ fix: true }),
    /**
     * The following plugin creates asset-manifest.json with links to all generated files
     * .map(sourcemap) files are excluded.
     */
    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: "/",
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
          fileName => !fileName.endsWith(".map")
        );

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    // ...(!isProduction ? [new BundleAnalyzerPlugin()] : []),
    // This outputs css as file
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
    }),
    // This is to copy from public to build except index.html and manifest.json
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./public"),
          to: path.resolve(__dirname, "./build"),
          filter: async resourcePath => {
            if (/index.html|manifest.json/.test(resourcePath)) {
              return false;
            }
            return true;
          },
        },
      ],
    }),
    // This plugin injects generated files into index.html file
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      base: "/",
    }),
    // React will be made available globally
    new webpack.ProvidePlugin({
      React: "react",
    }),
    // This handle env variables and provides them as process.env globally
    // webpack5 doesn't support process, hence this is needed.
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, "./public"),
    open: true,
    compress: true,
    hot: true,
    port: process.env.PORT || 3000,
  },
};
