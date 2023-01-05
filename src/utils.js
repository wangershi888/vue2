const strats = {}; // 策略
const LIFECYCLE = ["beforeCreate", "created"];
LIFECYCLE.forEach((hook) => {
  // 这里维护一个每个生命周期的队列
  // created: [fn, fn]
  strats[hook] = function (p, c) {
    // 如果儿子有，父亲有，让父亲和儿子拼在一起
    if (c) {
      if (p) {
        return p.concat(c);
      } else {
        return [c]; // 儿子有，父亲没有，则将儿子包装为数组
      }
    } else {
      return p; // 儿子没有，则直接使用父亲
    }
  };
});

export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    // 循环老的
    mergeField(key);
  }
  for (let key in child) {
    // 循环新的
    if (!parent.hasOwnProperty(key)) {
      // 如果老的没有当前属性，也去合并
      mergeField(key);
    }
  }
  function mergeField(key) {
    // 使用策略模式减少if-else
    if (strats[key]) {
      // 在策略中，调用策略
      options[key] = strats[key](parent[key], child[key]);
    } else {
      // 不在策略中，优先采用儿子的， 再采用父亲的
      options[key] = child[key] || parent[key];
    }
  }
  return options;
}
