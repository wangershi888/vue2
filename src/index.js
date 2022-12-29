import { initMixin } from "./init";

// options: 当前Vue实例的选项
function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 扩展了init方法

export default Vue;
