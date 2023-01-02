import { initMixin } from "./init";
import { initLifecycle } from "./lifecycle";

// options: 当前Vue实例的选项
function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 扩展了init方法
initLifecycle(Vue); // 扩展生命周期方法

export default Vue;
