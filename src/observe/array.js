// 对数组中，改变数组的方法进行重写

let oldArrayProto = Array.prototype; // 获取数组的原型

// 拷贝一份新的数组原型
export let newArrayProto = Object.create(oldArrayProto);

let methods = [
  // 找到所有能改变原数组的方法
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reserve",
  "sort",
];

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    const result = oldArrayProto[method].call(this, ...args); // 内部调用原来的方法，函数的劫持， 切片编程，这里的this相当于代码中调用数组方法的this

    // 需要对新增的数据再次进行劫持， 对新增元素也要进行检测
    let inserted; // 获取新增内容（数组）
    let ob = this.__ob__; // 获取this的observe实例

    switch (method) {
      case "push":
        inserted = args;
        break;
      case "unshift":
        break;
      case "splice": // arr.splice() 的第三个参数
        inserted = args.slice(2);
        break;
    }
    // 将获取到的inserted，当前新增元素的数组，再次进行observerArray
    console.log(inserted);
    if (inserted) {
      // 再次进行对新增内容的劫持检测
      ob.observeArray(inserted);
    }
    return result;
  };
});
