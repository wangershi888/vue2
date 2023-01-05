import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom";

// 创建真实元素
function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag); // 将真实节点挂载到真实节点上

    // 更新当前元素属性
    patchProps(vnode.el, data);

    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    // 创建文本
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function patchProps(el, props) {
  for (let key in props) {
    if (key === "style") {
      for (let styleName in props[key]) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
function patch(oldVNode, newVNode) {
  // 初步渲染流程
  // 判断oldVNode是一个真实元素还是一个虚拟节点
  const isRealElement = oldVNode.nodeType;
  if (isRealElement) {
    // 需要删掉之前的元素，更换为新元素
    const elm = oldVNode;
    const parentElm = elm.parentNode; // 拿到父元素
    // 创建真实元素
    let newElm = createElm(newVNode);
    parentElm.insertBefore(newElm, elm.nextSibing);
    parentElm.removeChild(oldVNode);
    return newElm;
  } else {
    // 走diff算法
  }
}

// 扩展方法
export function initLifecycle(Vue) {
  // 虚拟dom转换为真实dom
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;

    // patch既有初始化的功能也有更新的功能
    vm.$el = patch(el, vnode);
  };

  // _c: 创建元素 _v: 创建文本 _s: JSON.stringify
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };

  // 构建虚拟dom，使用响应式数据
  Vue.prototype._render = function () {
    // 让 render的 with作用域中的this 指向vm，返回虚拟节点
    // 当渲染的时候会去实例中取值，我们就可以和实例绑定在一起
    return this.$options.render.call(this);
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  /**
   * 1、调用render方法，生成虚拟dom _render()
   * 2、将虚拟dom转换为真实dom _update()
   * 3、将真实dom挂载到el上
   */
  const updateComponent = () => {
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, true);
}

export function callHook(vm, hook) {
  let handlers = vm.$options[hook];
  if (handlers) {
    handlers.forEach((handler) => {
      handler.call(vm);
    });
  }
}
