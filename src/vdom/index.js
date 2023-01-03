// h() _c() 都是这个方法 创建元素虚拟节点
export function createElementVNode(vm, tag, data = {}, ...children) {
  let key = data == null ? undefined : data.key;
  if (key) delete data.key;
  return vnode(vm, tag, key, data, children);
}

// _s() 创建文本虚拟节点
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// 描述dom
// ast为 描述 js、css、html语言本身，与vue没关系
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}
