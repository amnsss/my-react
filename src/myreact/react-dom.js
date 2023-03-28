import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

function render(vnode, container) {
  const FiberRoot = {
    type: container.nodeName.toLowerCase(),
    stateNode: container,
    props: {
      children: vnode,
    },
  }

  scheduleUpdateOnFiber(FiberRoot);
}

export default {
    render
}