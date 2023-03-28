import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

let workInProgressHook = null; // 当前正在工作的hook
let currentlyRenderingFiber = null; // 当前正在渲染的fiber

export function renderHooks(wip) {
  currentlyRenderingFiber = wip;
  currentlyRenderingFiber.memoizedState = null;
  workInProgressHook = null;
}

// fiber.memoizedState -> hook(next) -> hook(next) -> hook(next)
function updateWorkInProgressHook() {
  let hook;
  const current = currentlyRenderingFiber.alternate;
  if (current) {
    // 不是初次渲染，是更新，意味着可以在老hook基础上更新
    currentlyRenderingFiber.memoizedState = current.memoizedState;
    if (workInProgressHook) {
      // 不是第一个hook
      hook = workInProgressHook = workInProgressHook.next;
    } else {
      // 第一个hook
      hook = workInProgressHook = current.memoizedState;
    }
  } else {
    // 初次渲染
    hook = {
      memoizedState: null,
      next: null,
    }
    if (workInProgressHook) {
      // 不是第一个hook
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // 第一个hook
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
    }
  }
  
  return hook;
}


export function useReducer(reducer, initialState) {
  // 1. 获取当前正在工作的hook
  const hook = updateWorkInProgressHook();

  if (!currentlyRenderingFiber.alternate) {
    hook.memoizedState = initialState;
  }

  const dispatch = action => {
    hook.memoizedState = reducer(hook.memoizedState, action);
    scheduleUpdateOnFiber(currentlyRenderingFiber);
  };

  return [hook.memoizedState, dispatch];
}