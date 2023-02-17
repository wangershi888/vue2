import { observe } from "./observe/index";

export function initState(vm) {
  // 对我们的数据进行劫持
  const opts = vm.$options; // 获取所有选项
  if (opts.data) {
    // 如果有data选项，那么我们初始化data
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      return (vm[target][key] = newValue);
    },
  });
}

function initData(vm) {
  let data = vm.$options.data; // data可能是函数、可能是对象
  // vue2中，根实例可以是函数，也可以是对象，组建中必须是函数
  data = typeof data === "function" ? data.call(this) : data;

  vm._data = data; // 相当于将对象挂载到了实例上
  // 对数据进行劫持 Object.defineProperty
  observe(data);

  // 将vm._data 作为vm 代理
  for (let key in data) {
    proxy(vm, "_data", key);
  }
}

function initComputed(vm) {
  // 获取到用户写的代码
  const computed = vm.$options.computed;

  for (let key in computed) {
    let userDef = computed[key];

    defineComputed(vm, key, userDef);
  }

  function defineComputed(target, key, userDef) {
    // 有可能是对象也有可能是函数
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    const setter = userDef.set || (() => {});

    // 可以通过实例获取到对应的属性
    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
    });
  }
}
