import { newArrayProto } from "./array";

class Observer {
  constructor(data) {
    // 当前observer的实例，给数据加了标识，如果数据上有__ob__，则说明当前属性被观测过
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, // 将__ob__变成不可枚举，否则每个对象添加一个__ob__，会导致死循环（疯狂检测__ob__中的内容）
    });
    // 修改数组 很少用索引来操作，因此使用内部劫持的方式来捕捉数组变化会浪费性能
    // 因此重写改变数组的几个方法
    // 这几个改变数组的方法，Object.defineProperty捕捉不到数据变化，因此需要重写
    if (Array.isArray(data)) {
      // 重写原来数组的几个方法
      data.__proto__ = newArrayProto;
      this.observeArray(data);
    }
    // Object.defineProperty只能劫持已存在的属性，新增或者删除是不知道的，因此Vue新增了一些api $set $delete等
    this.walk(data); // 遍历当前对象
  }

  // 循环对象，对属性依次劫持，重新定义属性（Vue2性能瓶颈）
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }

  // 进行数组观测
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
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
  if (data.__ob__ instanceof observe) {
    // 说明被观测过了
    return data.__ob__;
  }
  // 如果一个对象被劫持过了，那么后续就不用劫持了，判断一个对象是否被劫持过，可以通过一个实例来判断当前对象是否被劫持过

  return new Observer(data);
}
