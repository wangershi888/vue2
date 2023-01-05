import { initGlobalAPI } from "./globalAPI";
import { initMixin } from "./init";
import { initLifecycle } from "./lifecycle";
import { nextTick } from "./observe/watcher";

// options: 当前Vue实例的选项
function Vue(options) {
  this._init(options);
}

Vue.prototype.$nextTick = nextTick;

initMixin(Vue); // 扩展了init方法
initLifecycle(Vue); // 扩展生命周期方法
initGlobalAPI(Vue);

export default Vue;
