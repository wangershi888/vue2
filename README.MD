# vue2 核心源码

## 使用 Rollup 搭建开发环境

安装 rollup

```
npm i rollup rollup-plugin-babel @babel/core @babel/preset-env --save-dev
```

配置 rollup

在`rollup.config.js`中进行配置

在 package.json 中配置启动命令

```
  "scripts": {
    "dev": "rollup -cw", // -c 表示使用默认rollup配置（rollup.config.js） -w 表示监控文件变化
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

## 响应式的数据变化

核心： 数据变化了，我们可以监控到数据的变化（属性的取值 和 更改值），在监控到数据的变化后，我们去更新视图。

类的特点：将所有的方法都耦合到一起，所以 Vue 在设计的时候，并没有使用 class 语法，使用了构造函数进行 Vue 对象的创建。从而将扩展的功能在其他模块进行分开管理。

## 对象响应式原理
