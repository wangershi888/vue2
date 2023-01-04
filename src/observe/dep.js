let id = 0;

// 属性的dep需要收集watcher

class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 收集当前属性对应的watcher有哪些
  }
  depend() {
    // 我们不希望一个dep收集同一个watcher，需要去重复
    // 让watcher去记录dep
    Dep.target.addDep(this);
  }
  addSub(watcher) {
    // watcher告诉dep记住watcher，实现了双向去重
    this.subs.push(watcher);
  }
  notify() {
    // 让自己身上存储的所有watcher进行更新
    this.subs.forEach((watcher) => watcher.update());
  }
}

Dep.target = null;

export default Dep;
