import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;

/***
 * 1）当我们创建Watcher的时候，会把当前的渲染Watcher挂载到Dep.target上
 * 2) 调用_render() 会进行取值，走到属性的get()上
 *  */

/**
 * 每个属性有一个dep，这个dep就是被观察者
 * watcher就是观察者
 * dep变化了，会通知观察者来更新
 */

class Watcher {
  // 不同组件有不同的watcher   目前只有一个 渲染根实例的
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++;
    this.renderWatcher = options; // 是一个渲染watcher

    if (typeof exprOrFn === "string") {
      this.getter = function () {
        return vm[exprOrFn];
      };
    } else {
      this.getter = exprOrFn; // getter意味着调用这个函数可以发生取值操作
    }

    this.deps = []; // 后续我们实现计算属性，和一些清理工作需要用到
    this.depsId = new Set();
    this.lazy = options.lazy;
    this.cb = cb;
    this.dirty = this.lazy; // 缓存值
    this.vm = vm;
    this.user = options.user; // 标识是否是用户自己的watcher

    this.value = this.lazy ? undefined : this.get();
  }
  addDep(dep) {
    // 一个组件 对应着多个属性 重复的属性也不用记录
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this); // watcher已经记住了dep了而且去重了，此时让dep也记住watcher
    }
  }
  evaluate() {
    this.value = this.get(); // 获取到用户函数的返回值 并且还要标识为脏
    this.dirty = false;
  }
  get() {
    pushTarget(this); // 静态属性就是只有一份
    let value = this.getter.call(this.vm); // 会去vm上取值  vm._update(vm._render) 取name 和age
    popTarget(); // 渲染完毕后就清空
    return value;
  }
  depend() {
    // watcher的depend 就是让watcher中dep去depend
    let i = this.deps.length;
    while (i--) {
      // dep.depend()
      this.deps[i].depend(); // 让计算属性watcher 也收集渲染watcher
    }
  }
  update() {
    if (this.lazy) {
      // 如果是计算属性  依赖的值变化了 就标识计算属性是脏值了
      this.dirty = true;
    } else {
      queueWatcher(this); // 把当前的watcher 暂存起来
      // this.get(); // 重新渲染
    }
  }
  run() {
    let oldValue = this.value;
    let newValue = this.get(); // 渲染的时候用的是最新的vm来渲染的
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  flushQueue.forEach((q) => {
    q.run(); // 刷新的过程中，可能会有新的watcher也会重新放到queue中
  });
  queue = [];
  has = {};
  pending = false;
}

function queueWatcher(watcher) {
  const { id } = watcher;
  // 去重添加watcher
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }
}

let callbacks = [];
let waitting = false;

function flushCallbakcs() {
  let cbs = callbacks.slice(0);
  waitting = true;
  callbacks = [];
  cbs.forEach((cb) => cb());
  waitting = false;
}

// 谁先调先执行谁
export function nextTick(cb) {
  // 源码中没有使用setTimeout，使用了优雅降级
  // nextTick 没有直接使用某个api 而是采用优雅降级的方式
  // 内部先采用的是promise （ie不兼容）  MutationObserver(h5的api)  可以考虑ie专享的 setImmediate  setTimeout

  // let timerFunc;
  // if (Promise) {
  //     timerFunc = () => {
  //         Promise.resolve().then(flushCallbacks)
  //     }
  // }else if(MutationObserver){
  //     let observer = new MutationObserver(flushCallbacks); // 这里传入的回调是异步执行的
  //     let textNode = document.createTextNode(1);
  //     observer.observe(textNode,{
  //         characterData:true
  //     });
  //     timerFunc = () => {
  //         textNode.textContent = 2;
  //     }
  // }else if(setImmediate){
  //     timerFunc = () => {
  //        setImmediate(flushCallbacks);
  //     }
  // }else{
  //     timerFunc = () => {
  //         setTimeout(flushCallbacks);
  //      }
  // }
  callbacks.push(cb); // 维护nextTick中的callback方法
  if (!waitting) {
    // 将callbacks依次执行
    setTimeout(() => {
      flushCallbakcs();
    }, 0);
  }
}
// 需要给每个属性增加一个dep，目的是为了收集dep
// 一个dep对应多个watcher
// 一个watcher 会对应多个dep

export default Watcher;
