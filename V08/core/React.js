function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const testNode = typeof child === "string" || typeof child === "number"
        return testNode ? createTextNode(child) : child
      }),
    },
  }
}

function render(el, container) {
  nextWork = {
    dom: container,
    props: {
      children: [el],
    },
  }
  root = nextWork
}

let nextWork = null
let root = null
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWork) {
    nextWork = performWorkOfUnit(nextWork)

    shouldYield = deadline.timeRemaining() < 1
  }
  // 只需要执行一次
  if (!nextWork && root) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
function commitRoot() {
  commitWork(root.child)
  root = null
}
function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== "children") {
      // 事件处理
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase() // 转换成小写
        dom.addEventListener(eventType, props[key])
      } else {
        dom[key] = props[key]
      }
    }
  })
}

function initChildren(fiber, children) {
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]

  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    updateProps(dom, fiber.props)
  }
  const children = fiber.props.children
  initChildren(fiber, children)
}
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  // 循环去找父级
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
