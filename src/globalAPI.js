import { mergeOptions } from "./utils";

export function initGlobalAPI(Vue) {
  Vue.options = {};

  Vue.mixin = function (mixin) {
    // 我们期望将用户的选项和全局的options进行合并
    this.options = mergeOptions(this.options, mixin);
    console.log(this.options);
    return this;
  };
}
