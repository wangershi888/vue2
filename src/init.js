import { initState } from "./state";
import { compileRoFunction } from "./compiler";
import { mountComponent, callHook } from "./lifecycle";
import { mergeOptions } from "./utils";
// 用于给Vue扩展方法
export function initMixin(Vue) {
  // 用于初始化操作
  Vue.prototype._init = function (options) {
    const vm = this;
    // 我们定义的全局指令都会挂载到$options
    vm.$options = mergeOptions(this.constructor.options, options); // 将当前配置挂载在实例的$options上 所有以$开头的，都是Vue自己的属性
    callHook(vm, "beforeCreate");
    // 初始化状态
    initState(vm);
    callHook(vm, "created");

    if (options.el) {
      vm.$mount(options.el); // 实现数据的挂载
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);

    let ops = vm.$options;
    if (!ops.render) {
      // 先查找有没有render，再去查找是否有template。没有template，则直接使用外部的el下的HTML
      let template;
      if (!ops.template && el) {
        // 没有模板，但是有el，我们去取el下的内容
        template = el.outerHTML;
      } else {
        if (el) {
          template = ops.template;
        }
      }
      // 如果有template，则就需要编译
      if (template) {
        const render = compileRoFunction(template);
        ops.render = render; // jsx最终会被编译成h函数
      }
    }

    mountComponent(vm, el); // 组件的挂载
  };

  // script标签引入的vue.global.js 这个编译过程是在浏览器运行的
  // runtime是不包含编译模板的，整个编译时打包的时候通过loader来转义.vue文件的，因此，用runtime的时候不能使用template选项
  // runtimeWithCompiler 带编译的
}
