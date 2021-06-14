import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

import pkg from "./package.json";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: "./index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    postcss(),
    babel({ exclude: "node_modules/**" }),
    resolve({ extensions: [".js", ".json", ".jsx"] }),
    commonjs(),
    image(),
    json()
  ],
};
