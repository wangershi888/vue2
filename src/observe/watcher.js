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
  // 不同的组件有不同的watcher
  constructor(vm, fn, options) {
    this.id = id++;
    this.renderWatcher = options; // 标识是一个渲染watcher
    this.getter = fn; // getter 意味着调用这个函数可以发生取值操作
    this.deps = []; // watcher 收集当前组件中的dep，后期实现计算属性以及清理不用dep等
    this.depsId = new Set();
    this.get();
  }
  addDep(dep) {
    // 去重记录
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(dep); // watcher去重记录dep
      dep.addSub(this); // dep记录watcher
    }
  }
  get() {
    pushTarget(this);
    // Dep.target = this; // 将当前Watcher挂载到Dep的target上
    this.getter(); // 获取vm上的值，渲染
    popTarget();
    // Dep.target = null; // 渲染完毕后就进行清空
  }
  update() {
    // 不立即更新，等同步任务结束后，再统一进行一次更新
    queueWatcher(this); // 把当前watcher暂存起来
  }
  run() {
    this.get(); // 重新渲染
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
