// 包装合成事件
class SyntheticEvent {
  constructor(e){
    this.nativeEvent = e;
  }
  stopPropagation(){
    this._stopPropagation = true;
    if(this.nativeEvent.stopPropagation) {
      this.nativeEvent.stopPropagation();
    }
  }
}

// 收集路径中的事件回调函数
const collectPaths = (type, begin) => {
  const paths = [];

  // 不是根FiberNode的话，就一直向上遍历
  while (begin.tag !== 3) {
    const { memoizedProps, tag } = begin;

    // 5代表DOM节点对应FiberNode
    if (tag === 5) {
      const eventName = ("on" +type).toUpperCase();

      // 如果包含对应事件回调，保存在paths中
      if(memoizedProps && Object.keys(memoizedProps).includes(eventName)) {
        const pathNode = {};
        pathNode[type.toUpperCase()] = memoizedProps[eventName];
        paths.push(pathNode);
      }
    }
    begin = begin.return;
  }
  return paths;
}

// 捕获阶段的实现
const triggerEventFlow = (paths, type, se) => {
  // 从后向前遍历
  for(let i = paths.length; i--;){
    const pathNode = paths[i];
    const callback = pathNode[type];
    if(callback) {
      // 存在回调函数，传入合成事件，执行
      callback.call(null, se);
    }
    if(se._stopPropagation) {
      // 如果执行了se.stopPropagation(),取消接下来的遍历
      break;
    }
  }
}

const dispatchEvent = (e, type) => {
  // 包装合成事件
  const se = new SyntheticEvent(e);
  const ele = e.target;

  // 比较hack的方法，通过DOM节点找到对应的FiberNode
  let fiber;
  for(let prop in ele) {
    if(prop.toLowerCase().includes('fiber')){
      fiber = ele[prop];
    }
  }

  // 第三步： 收集路径中"该事件的所有回调函数"
  const paths = collectPaths(type, fiber);

  // 第四步：捕获阶段的实现
  triggerEventFlow(paths, type + "CAPTURE", se);

  // 第五步：冒泡阶段的实现
  if(!se._stopPropagation) {
    triggerEventFlow(paths.reverse(),type, se);
  }
}

export const addEvent = (container, type) => {
  container.addEventListener(type, (e) => {
    dispatchEvent(e, type.toUpperCase(), container)
  })
}