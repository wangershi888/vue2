// rollup默认可以导出一个对戏那个，作为打包的配置文件
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "./src/index.js", //入口
  output: {
    file: "./dist/vue.js", //出口
    name: "Vue",
    format: "umd", // esm es6模块 commonjs模块 iife自执行函数 umd统一模块规范，兼容(amd、commonjs，不兼容es6)
    sourcemap: true, // 希望可以调试源代码
  },
  plugins: [
    // 打包的时候，可以使用这些插件
    babel({
      exclude: "noe_modules/**", // 排除node_modules所有文件
    }),
    resolve(),
  ],
};
