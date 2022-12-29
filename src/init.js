import { initState } from "./state";

// 用于给Vue扩展方法
export function initMixin(Vue) {
  // 用于初始化操作
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options; // 将当前配置挂载在实例的$options上 所有以$开头的，都是Vue自己的属性
    // 初始化状态
    initState(vm);
  };
}
