function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === "string" ? createTextNode(child) : child
      }),
    },
  }
}

function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

// 当前的任务
let nextWork = null

function render(el, container) {
  nextWork = {
    dom: container,
    props: {
      children: [el],
    },
  }
}

function workLoop(deadline) {
  let shouldRun = false
  while (!shouldRun && nextWork) {
    // 执行Dom
    nextWork = performWorkOfUnit(nextWork)
    console.log("", nextWork)

    shouldRun = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
function performWorkOfUnit(work) {
  if (!work.dom) {
    // 1.创建 DOM
    const dom = (work.dom =
      work.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(work.type))
    work.parent.dom.append(dom)
    // 2.处理 props

    // 设置id和class
    Object.keys(work.props).forEach(key => {
      if (key !== "children") {
        // 给DOM创建props
        dom[key] = work.props[key]
      }
    })
  }
  // 3.处理节点之间的关系
  const children = work.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      work.child = newWork
    } else {
      prevChild.sibling = newWork
    }
    prevChild = newWork
  })
  // 4.返回下一个任务

  if (work.child) {
    return work.child
  }
  if (work.sibling) {
    return work.sibling
  }
  return work.parent?.sibling
}
requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
