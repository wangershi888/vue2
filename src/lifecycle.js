// 扩展方法
export function initLifecycle(Vue) {
  // 虚拟dom转换为真实dom
  Vue.prototype._update = function () {};
  // 构建虚拟dom，使用响应式数据
  Vue.prototype._render = function () {};
}

export function mountComponent(vm, el) {
  /**
   * 1、调用render方法，生成虚拟dom _render()
   * 2、将虚拟dom转换为真实dom _update()
   * 3、将真实dom挂载到el上
   */
  vm._update(vm._render());
}
