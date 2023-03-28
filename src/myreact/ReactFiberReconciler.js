import { createFiber } from "./createFiber";
import { isStringOrNumber, updateNode } from "./utils";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, {}, wip.props);
  }

  reconcileChildren(wip, wip.props.children);
}

export function updateFunctionComponent(wip) {
    const { type, props } = wip;
    const children = type(props);
    reconcileChildren(wip, children);
}

export function updateClassComponent(wip) {
    const { type, props } = wip;
    const children = (new type(props)).render();
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

  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    const newFiber = createFiber(child, wip);

    if (!prevNewFiber) {
      wip.child = newFiber;
    } else {
      prevNewFiber.sibling = newFiber;
    }
    prevNewFiber = newFiber;
  }
}
