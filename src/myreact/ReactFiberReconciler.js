import { createFiber } from "./createFiber";
import { renderHooks } from "./Hook";
import { isStringOrNumber, Update, updateNode } from "./utils";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, {}, wip.props);
  }

  reconcileChildren(wip, wip.props.children);
}

export function updateFunctionComponent(wip) {
  renderHooks(wip);
  const { type, props } = wip;
  const children = type(props);
  reconcileChildren(wip, children);
}

export function updateClassComponent(wip) {
  const { type, props } = wip;
  const children = new type(props).render();
  reconcileChildren(wip, children);
}

export function updateFragmentComponent(wip) {
  reconcileChildren(wip, wip.props.children);
}

export function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = Array.isArray(children) ? children : [children];

  let prevNewFiber = null;
  let oldFiber = wip.alternate && wip.alternate.child;
  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    const newFiber = createFiber(child, wip);

    if (sameNode(oldFiber, newFiber)) {
      // 更新
      Object.assign(newFiber, {
        alternate: oldFiber,
        stateNode: oldFiber.stateNode,
        flags: Update,
      });
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (!prevNewFiber) {
      wip.child = newFiber;
    } else {
      prevNewFiber.sibling = newFiber;
    }
    prevNewFiber = newFiber;
  }
}

function sameNode(a, b) {
  return a && b && a.key === b.key && a.type === b.type;
}
