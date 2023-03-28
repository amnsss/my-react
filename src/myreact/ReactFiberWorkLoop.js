import { updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostComponent } from "./ReactFiberReconciler";
import { isFn, isStr, NoFlags, Placement } from "./utils";

let wipRoot = null; // 正在工作的根fiber
let nextUnitOfWork = null; // 下一个要执行的任务

export function scheduleUpdateOnFiber(fiber) {
  wipRoot = fiber;
  wipRoot.sibling = null;

  nextUnitOfWork = wipRoot;
}

function performUnitOfWork(wip) {
  // 1. 执行当前任务
  // 2. 返回下一个任务
  const { type } = wip;
  if (isFn(type)) {
    type.isReactComponent
      ? updateClassComponent(wip)
      : updateFunctionComponent(wip);
  } else if (isStr(type)) {
    updateHostComponent(wip);
  } else {
    updateFragmentComponent(wip);
  }

  // 返回下一个任务
  if (wip.child) {
    return wip.child;
  }
  
  while (wip) {
    if (wip.sibling) {
      return wip.sibling;
    }
    wip = wip.return;
  }

  return null;
}

function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

//   requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 提交阶段
function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(wip) {
    if (!wip) {
        return;
    }

    const { stateNode, flags } = wip;

    const parentNode = getParentNode(wip);
    if (flags & Placement && stateNode) {
        parentNode.appendChild(stateNode);
    } 

    wip.flags = NoFlags;
    commitWorker(wip.child);
    commitWorker(wip.sibling);
}

function getParentNode(wip) {
  let parent = wip.return;
  while(parent) {
    if (parent.stateNode) {
      return parent.stateNode;
    }
    parent = parent.return;
  }
  return null;
}