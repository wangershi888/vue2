class Observer {
  constructor(data) {
    // Object.defineProperty只能劫持已存在的属性，新增或者删除是不知道的，因此Vue新增了一些api $set $delete等
    this.walk(data); // 遍历当前对象
  }
  walk(data) {
    // 循环对象，对属性依次劫持，重新定义属性（Vue2性能瓶颈）
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}

export function defineReactive(target, key, value) {
  observe(value); // 对所有的对象都进行属性劫持，构成递归
  // 利用闭包，当前作用域不会被销毁
  Object.defineProperty(target, key, {
    // 取值的时候会执行get
    get() {
      return value;
    },
    // 修改的时候会执行set
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
    },
  });
}

export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== "object" || data === null) {
    return;
  }
  // 如果一个对象被劫持过了，那么后续就不用劫持了，判断一个对象是否被劫持过，可以通过一个实例来判断当前对象是否被劫持过

  return new Observer(data);
}
