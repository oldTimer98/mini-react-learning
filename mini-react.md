



当你想要快速掌握React开发技能却又感到困惑时，七天学会mini-react将成为你的最佳选择！这款全新的学习工具不仅简洁易懂，还能帮助你在短短七天内掌握React的精髓。无需繁琐的教程，无需枯燥的学习过程，只需七天，你就能成为React开发的高手！赶快加入我们，一起探索无限可能吧！`#学习React` `#快速掌握技能` `#七天挑战` `#mini-react`

**查看目录**

[TOC]

# 1、七天搞定`mini-react`

## 第一天: 实现最简 `mini-react`

### 实现最简 `mini-react`

首先我们试着实现一下`render`函数,在这之前我们可以先看看是它是如何渲染到页面上的，如果要是我们会怎么做？

我们先来创建两个文件

```html
// index.html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="root"></div>
</body>
<script src="./main.js" type="module"></script>

</html>

```

```js
// main.js
const dom = document.createElement("div")
dom.id = "app"
document.querySelector("#root").append(dom)
const textNode = document.createTextNode("")
textNode.nodeValue = "app"
dom.appendChild(textNode)
```

我们创建了一个`id`为`root`的`div`，我们需要在`root`里面创建一个`id`为`app`的`div`，我们通过原生方法去创建，并且我们还创建了一个`textNode`节点，并赋值为`app`，最后把文本节点放在了新创建的`div`中，这样就简单的完成了`app`的挂载

接下来我们对代码进行优化，我们使用对象来模拟节点，相当于虚拟DOM的方式，文本类型就是`TEXT_ELEMENT`

```js
const textEl = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "app",
    children: [],
  },
}
const el = {
  type: "div",
  props: {
    id: "app",
    children: [textEl],
  },
}
const dom = document.createElement(el.type)
dom.id = el.props.id
document.querySelector("#root").append(dom)
const textNode = document.createTextNode("")
textNode.nodeValue = textEl.props.nodeValue
dom.appendChild(textNod
```

接下来我们继续对代码进行优化，发现很多代码都是在创建元素，接下来我们来实现具体方法,我们创建两个方法，专门用来创建普通元素，以及文本元素

```js
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

function createTextNode(text, ...children) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children,
    },
  }
}

const textEl = createTextNode("app")
const App = createElement("div", { id: "app" }, textEl)

const dom = document.createElement(App.type)
dom.id = App.props.id
document.querySelector("#root").append(dom)

const textNode = document.createTextNode("")
textNode.nodeValue = textEl.props.nodeValue
dom.appendChild(textNode)
```

通过运行，发现在处理普通元素的时候，需要对`children`进行处理,如果内容为文本元素，需要使用`createTextNode`方法，修改完之后，页面正确显示app

接下来我们就可以来实现`render`方法啦！

这里在处理`el.props`和`el.children`时，需要分开处理，使用递归的方式，就可以实现`render`啦

```js
function render(el, container) {
  const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type)

  // 设置id和class
  Object.keys(el.props).forEach(key => {
    if (key !== "children") {
      // 给DOM创建props
      dom[key] = el.props[key]
    }
  })

  const children = el.props.children
  children.forEach(child => {
    render(child, dom)
  })
  container.append(dom)
}

const textEl = createTextNode("app")
// const App = createElement("div", { id: "app" }, textEl)
const App = createElement("div", { id: "app" }, "hi-", "mini-react")
render(App, document.querySelector("#root"))
```

我们可以修改`children`的内容，发现运行十分成功，非常完美!

我们打印下`app`的内容，发现跟我们的虚拟`dom`一模一样

![image-20240326150847147](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261508210.png)

接下来我们来实现这个吧

![image-20240326151000443](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261510490.png)

```js
const ReactDOM = {
  createRoot(container) {
    return {
      render(el) {
        render(el, container)
      },
    }
  },
}
ReactDOM.createRoot(document.querySelector("#root")).render(App)
```

通过运行，我们发现没有问题，这样我们就已经实现了

接下来我们对代码进行抽离

![image-20240326152020085](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261520131.png)

将代码进行抽离

```js
// React.js
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

function createTextNode(text, ...children) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children,
    },
  }
}

function render(el, container) {
  const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type)

  // 设置id和class
  Object.keys(el.props).forEach(key => {
    if (key !== "children") {
      // 给DOM创建props
      dom[key] = el.props[key]
    }
  })

  const children = el.props.children
  children.forEach(child => {
    render(child, dom)
  })
  container.append(dom)
}

const React = {
  render,
  createElement,
}

export default React
```

```js
// ReactDom.js
import React from "./React.js"

const ReactDOM = {
  createRoot(container) {
    return {
      render(el) {
        React.render(el, container)
      },
    }
  },
}

export default ReactDOM

```

```js

// App.js
import React from "./core/React.js"

const App = React.createElement("div", { id: "app" }, "hi-", "mini-react")

export default App
```

```js
// index.js
import ReactDOM from "./core/ReactDom.js"
import App from "./App.js"

ReactDOM.createRoot(document.querySelector("#root")).render(App)

```

这样我们就已经完成了简单的`mini-react`,但是，我们毕竟是用`js`来实现的，但是一般我们是使用`jsx`啊，那怎么办呢？后面我们就来实现`jsx`的版本,请等待下一章更新

### 使用 `jsx`

这里我们想使用`JSX`的话，我们需要借助一些库，例如`webpack、bable、vite`都行，这里的话，我们采用`vite`去实现

首页安装一下`vite`

```js
pnpm create vite
```

![image-20240326155746744](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261557812.png)

这里选择第一个就行

![image-20240326160150971](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261601028.png)

```js
// App.jsx
import React from "./core/React.js"

const App = React.createElement("div", { id: "app" }, "hi-", "mini-react")

export default App

```

```js
// main.js
import ReactDOM from "./core/ReactDom.js"
import App from "./App.jsx"

ReactDOM.createRoot(document.querySelector("#root")).render(App)

```

我们把上面的代码放进去，并且修改一下`main.js`的内容，并且需要修改一下`index.html`中的`id`等于`root`

然后运行,发现可以运行了

```js
import React from "./core/React.js"

// const App = React.createElement("div", { id: "app" }, "hi-", "mini-react")

const App = <div id="app">hi-mini-react</div>

console.log(App)
export default App

```

我们在`App.jsx`中去修改发现，依然可以运行，原因是因为我们导入了`React`，它会自动解析

但是我们在main.js中去修改的话，报错了

```js
import ReactDOM from "./core/ReactDom.js"
import App from "./App.jsx"

ReactDOM.createRoot(document.querySelector("#root")).render(<App></App>)

```

![image-20240326161025301](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261610382.png)

后面我们使用`function component` 也还是不行，最终原因是因为我们还没有实现，但是基本的我们通过`vite`去跑`jsx`是没有问题的。

### 扩展 - 使用 `vitest` 做单元测试

首先我们需要安装一下`vitest`

```js
pnpm i vitest -D
```

然后我们改一下`package.json`

```json
{
  "scripts": {
    "test": "vitest"
  },
	"devDependencies": {
		"vitest": "^1.4.0"
	}
}

```

我们添加一个新的文件

```js
// test/creatElement.spec.js
import React from "../core/React.js"
import { expect, describe, it } from "vitest"

describe("createElement", () => {
  it("props is null", () => {
    const el = React.createElement("div", null, "hi")

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)
  })
  it("should return element vdom", () => {
    const el = React.createElement("div", { id: "root" }, "hi")

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "root",
        },
        "type": "div",
      }
    `)
  })
})

```

然后我们通过`pnpm test` 去运行

运行成功,以后我们就可以添加测试了

![image-20240326170310062](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403261703146.png)

### 扩展 - 自定义 `react` 的名字

非常简单,只需要加一个注释语法即可

```js
/**@jsx CReact.createElement */
import CReact from "./core/React.js"

// const App = React.createElement("div", { id: "app" }, "hi-", "mini-react")

const App = <div id="app">hi-mini-react</div>

export default App

```

## 第二天：任务调度器 & `fiber` 架构

### 实现任务调度器

**问题：**为什么需要任务调度器？

**原因：**当我们节点数量非常大的时候，浏览器渲染会非常卡顿，因为浏览器是单线程的

**怎么解决：**分层思想，拆分每个任务，每个任务只执行两个任务

![image-20240327141041901](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403271410980.png)

我们通过`requestIdleCallback`这个函数，有一个参数叫`deadline`，它代表的是该任务下剩余的时间，通过这个我们可以来去实现任务调度器

```js
function workLoop(deadline) {
  console.log("deadline", deadline.timeRemaining())
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
```

这里就是简单的任务调度器，当剩余时间小于1的时候，我们就执行下个任务

```js
function workLoop(deadline) {
  console.log("deadline", deadline.timeRemaining())

  let shouldRun = false
  while (!shouldRun) {
    // 执行Dom
    shouldRun = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
```

### 实现`fiber`架构

> 首先认识一下什么是`fiber`架构：

`Fiber` 架构是一种用于构建用户界面的 React 应用程序的新架构。它是 React 16 版本中引入的一项重要功能。在传统的 React 架构中，React 使用了一种称为“协调”（Reconciliation）的机制来处理组件的更新和渲染。这种机制是基于递归的，意味着 React 会从根组件开始递归地遍历整个组件树，以确定哪些组件需要更新，并最终进行渲染。这种递归的算法在处理大型组件树或复杂的交互式用户界面时可能会导致性能问题。

`Fiber` 架构的目标是改进 React 的协调机制，以提高性能和用户体验。它引入了一种新的数据结构，称为 `Fiber`。`Fiber` 是一个轻量级的 JavaScript 对象，用于表示组件树中的每个组件和其相关的信息。

`Fiber` 架构使用了一种称为“时间切片”（Time Slicing）的技术，将组件的更新工作分解为多个小任务，并使用优先级调度算法来决定哪些任务应该优先执行。这样可以使 React 在处理大型组件树时更加灵活和高效，提高了应用程序的响应能力和性能。

通过引入 `Fiber` 架构，React 可以在每个任务之间进行中断和恢复，从而实现更好的并发和交互式体验。它还为 React 引入了一些新的功能，例如异步渲染、增量渲染和错误边界等。

总的来说，`Fiber` 架构是 React 的一种新的渲染引擎，旨在提高性能、并发能力和用户体验。它是 React 生态系统中的重要进步之一，为构建现代 Web 应用程序提供了更好的基础。

> 如何实现呢？

首先节点我们可以当成一个树结构，我们需要做的是把树结构转化成链表结构，我们才好去处理

如下图，查找节点的时候，我们可以认为是**孩子，兄弟，以及叔叔**，就可以按照下面来进行的话，就是`a-b-d-e-c-f-g`

![image-20240329134959683](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403291349766.png)

接下来我们就来完成这个方法吧,我们在原来的基础上进行修改

首先我们把`render`方法改一下,用特殊的结构存一下

```js
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
```

然后我们需要把我们实现的任务调度器安排上，这里需要执行的`performWorkOfUnit`函数，就是一会儿我们需要实现的具体转换方法，在执行的时候我们需要判断一下`nextWork`是否有值才行，并且返回的节点也需要重新赋值一下

```js
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

requestIdleCallback(workLoop)
```

接下来我们就来实现这个方法`performWorkOfUnit`

```js
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
```

这个方法是其实就是一个用于构建虚拟`DOM`树的函数。它接收一个表示工作单元的对象作为参数，并根据该工作单元的类型和属性创建相应的`DOM`元素。如果工作单元已经具有DOM元素，则跳过创建DOM的步骤。

接下来，它处理工作单元之间的关系，将它们连接成一个树形结构。它遍历工作单元的子节点数组，并为每个子节点创建一个新的工作单元对象，并将其链接到父节点的`child`或`sibling`属性上。

最后，它返回下一个要处理的工作单元。如果当前工作单元有子节点，则返回第一个子节点。如果当前工作单元有兄弟节点，则返回兄弟节点。如果当前工作单元既没有子节点也没有兄弟节点，则返回父节点的兄弟节点（如果有）。

> 我们看看最后创建的节点是什么？

![image-20240329163255859](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202403291632938.png)

可以看到，基本上的属性是都存在的，并且更好的表现出来了节点树之间的关系

到现在，我们就简单的完成了它们之间关系的转换，接下来我们对整体代码进行优化一下，拆分一下

```js
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
        return typeof child === "string" ? createTextNode(child) : child
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
}

let nextWork = null
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWork) {
    nextWork = performWorkOfUnit(nextWork)

    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
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

function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    fiber.parent.dom.append(dom)

    updateProps(dom, fiber.props)
  }

  initChildren(fiber)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React

```

> 我们所说的`work`其实就是`fiber`架构,这就是优化后的版本。

大家可以好好理解一下这个转化的过程。第二天的内容就到此为止啦！

## 第三天：统一提交 & 实现 `Function Component`

### 实现统一提交

> 问题：中途有可能没空余时间，用户会看到渲染一半的DOM

> 解决思路：计算结束后统一添加到屏幕里面

那怎么去实现呢？

1. 这里我们创建一个`root`变量，在执行`render`的时候，把整个节点记录一下
2. 在执行`workLoop`时，在最后执行结束前，去把未渲染完成的节点，统一的去添加在`dom`里
3. 这里只需要执行一次，所以我们在执行完，需要将`root`设置为`null`

```js
let root = null
function render(el, container) {
  nextWork = {
    dom: container,
    props: {
      children: [el],
    },
  }
  root = nextWork
}
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
  fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```

**这里需要把原来的添加操作去掉**

```js
function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    // fiber.parent.dom.append(dom)

    updateProps(dom, fiber.props)
  }

  initChildren(fiber)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}
```

这样一来我们就解决了这个问题！

### 实现 `Function Component`

我们先写一个函数组件`Couter`

```jsx
// APP.jsx
function Counter() {
  return (
    <div>
      <div>count</div>
    </div>
  )
}
function App(params) {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App
```

```js
import React from "./core/React.js"
import ReactDOM from "./core/ReactDom.js"
import App from "./App.jsx"

ReactDOM.createRoot(document.querySelector("#root")).render(<App></App>)

```

先分析一波，我们在写函数组件的时候，在函数`performWorkOfUnit中`的`fiber`的`type`，是一个函数，函数返回的内容，才是我们需要的`DOM`的,所以我们首先得判断一下

具体的分析图：

![image-20240401143059243](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404011430351.png)

这里是判断的是否是函数，如果是函数就是函数组件，函数组件的话，我们是不需要去创建`DOM`的,并且我们是需要的`children`类型是数组,所以我们用`[]`去包裹一下,并且我们要修改下`initChildren`方法，使用我们传入的`children`

```js
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
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))

      // fiber.parent.dom.append(dom)

      updateProps(dom, fiber.props)
    }
  }
  const children = isFunctionComponent ? [fiber.type()] : fiber.props.children

  initChildren(fiber, children)
  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent?.sibling
}
```

运行结果，确实渲染出来了

![image-20240401152623834](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404011526931.png)

接下来我们实现下`props`:我们传入一个`num`参数进去

```jsx
import React from "./core/React.js"

function Counter(props) {
  return (
    <div>
      <div>count:{props.num}</div>
    </div>
  )
}

function CounterContainer() {
  return (
    <div>
      <Counter num={12}></Counter>
    </div>
  )
}

function App(params) {
  return (
    <div>
      mini-react
      {/* <Counter></Counter> */}
      <CounterContainer></CounterContainer>
    </div>
  )
}

export default App
```

首先我们分析一下，我们之前的`createElement`函数，判断的只是`string`类型,我们现在传入的是`number`类型

```js
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
```

我们修改一下

```js
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
```

然后我们发现渲染不出来，最根本的原因就是在`commitWork`的时候，并没有添加`DOM`,原因是因为没有找到真实的`DOM`

我们修改一下

```js
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

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))

      // fiber.parent.dom.append(dom)

      updateProps(dom, fiber.props)
    }
  }
  const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children

  initChildren(fiber, children)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent?.sibling
}
```

我们去找到该`Fiber`节点的父节点，并一直向上遍历直到找到一个有真实`DOM`节点的父节点。

一旦找到了有真实`DOM`节点的父节点，就会将当前`Fiber`节点的`DOM`节点附加到父节点的`DOM`节点上。

![image-20240401153918292](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404011539394.png)

这样的话，我们就已经渲染出`props`了

又发现了一个问题，就是当我们运用两个组件的时候,页面只渲染了一个

```jsx
import React from "./core/React.js"

function Counter(props) {
  return (
    <div>
      <div>count:{props.num}</div>
    </div>
  )
}

function CounterContainer() {
  return (
    <div>
      <Counter num={12}></Counter>
      <Counter num={24}></Counter>
    </div>
  )
}

function App(params) {
  return (
    <div>
      mini-react
      {/* <Counter></Counter> */}
      <CounterContainer></CounterContainer>
    </div>
  )
}

export default App

```

原因：是因为在查找兄弟的时候，我们没有找到该组件的兄弟节点，所以返回错误

解决：

```js
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))

      // fiber.parent.dom.append(dom)

      updateProps(dom, fiber.props)
    }
  }
  const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children

  initChildren(fiber, children)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  // if (fiber.sibling) {
  //   return fiber.sibling
  // }

  // 循环去找父级
  let nextFiber = fiber
  while (nextFiber) {
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
  // return fiber.parent?.sibling
}
```

这样我们就解决了寻找兄弟组件的问题

接下来我们来重构下我们的代码

### 重构 `Function Component`

我们创建两个函数，分别表示是函数组件和非函数组件，优化后的代码如下：

```js
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
      dom[key] = props[key]
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

```

到目前为止，我们就已经实现了函数组件，后面我们会继续进军`VDOM`,加油`xdm`

## 第四天：进军 `vdom` 的更新

### 实现事件绑定

> 问题：点击触发更新

> 解决思路：基于`onClick`来注册点击事件

我们先写一个`button`按钮，绑定一下事件

```jsx
import React from "./core/React.js"

function Counter(props) {
  function handleClick() {
    console.log("click")
  }
  return (
    <div>
      <span>count:{props.num}</span>
      <button onClick={handleClick}>counter</button>
    </div>
  )
}

function CounterContainer() {
  return (
    <div>
      <Counter num={12}></Counter>
      <Counter num={24}></Counter>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <CounterContainer></CounterContainer>
    </div>
  )
}

export default App

```

然后我们来打印一下`fiber`

```js
function initChildren(fiber, children) {
  console.log('fiber',fiber);
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
```

![image-20240402093531143](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404020935260.png)

我们看见`button`里的`props`属性中有个`onClick`属性

所以我们需要对`on`开头的后面的事件做处理

我们需要判断`key`是否是`on`开头的，取出后面的事件名，并且是小写，然后去绑定到`dom`上就可以了

```js
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
```

这个是不是很简单，类似的其他时间都是这样去处理，接下来我们去实现一下，更新`props`

### 实现更新 `props`

更新`props`的核心，也就是对于两个虚拟`DOM`树的对比

> 这里就有几个问题？
>
> 1. 如何得到新的`DOM`树呢？
> 2. 如何找到老的节点？
> 3. 如何更新`props`呢？

首先我们更新一下我们的变量名称，现在的不怎么规范

`wipRoot`：表示的是正在工作中的根节点，我们之前是叫做`root`

`nextWorkOfUnit`：下一个工作单元，我们之前是叫做`nextWork`

因为我们的`wipRoot`会清空，所以我们新建一个变量来获取一下当前的最新的，用`currentRoot`来存储

```js
let currentRoot = null 
function commitRoot() {
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
```

然后我们需要怎么获取老的节点呢，首先我们需要在初始化`children`的时候去处理一下,这里之前是叫做`initChildren`,现在改成`reconcileChildren`，更加规范了

```js
function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type

    let newFiber
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      }
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: "placement",
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}
```

上面的方法，我们先来解释一下

这里我们通过`alternate`意为`替代/候补`，用来存储旧节点，并且我们通过`effectTag`来区分是否是新增还是更新操作

这里初始化了两个变量 `oldFiber` 和 `prevChild`。`oldFiber` 是从 `fiber.alternate` 中获取的旧 `Fiber` 节点的子节点，`prevChild` 则是用来跟踪上一个处理过的子节点。

**创建新节点**:然后我们去遍历子节点，检查当前子节点和旧节点是否是同一类型的节点，用来判断是否需要更新节点。然后再去创建子节点，并且根据节点类型创建新的 `Fiber` 节点，如果是相同类型的节点则标记为更新（`"update"`），否则标记为插入（`"placement"`）

**更新旧节点指针**:更新旧 `Fiber` 节点的指针，指向下一个旧节点，用于在下次循环中比较。

**链接新节点**:将新创建的 `Fiber` 节点链接到 `Fiber` 树中，根据位置分别设置为父节点的子节点或上一个节点的兄弟节点，并更新 `prevChild` 为当前处理的节点，以便下次循环使用。

然后我们就需要去修改**`updateProps`**

```js
function updateProps(dom, nextProps, prevProps) {
  // Object.keys(nextProps).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventType = key.slice(2).toLowerCase();
  //       dom.addEventListener(eventType, nextProps[key]);
  //     } else {
  //       dom[key] = nextProps[key];
  //     }
  //   }
  // });
  // {id: "1"} {}
  // 1. old 有  new 没有 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2. new 有 old 没有 添加
  // 3. new 有 old 有 修改
  Object.keys(nextProps).forEach(key => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase()

          dom.removeEventListener(eventType, prevProps[key])

          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}
```

这里我们传入第三个参数，表示之前的`props`，这里一共有三种对比，也就是

1. `old` 有  `new` 没有，那么就删除
2. `new` 有 `old` 没有，那么就添加
3. `new` 有 `old` 有 那么就修改

这里的二三的情况，我们合在一起去做，我们通过`dom.addEventListener(eventType, nextProps[key])`去绑定事件，在这里需要注意，我们在绑定事件之前需要先清空一下。

因为我们还没有实现`useState`，所以我们单独的写一个`update`方法，去执行,

这里的方法很简单，就是把处理好的新节点赋值就可以啦

```js
function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  }

  nextWorkOfUnit = wipRoot
}
```

接下来我们验证一下

```jsx
import React from "./core/React.js"

let count = 10
let props = { id: "11111111" }
function Counter() {
  // useState()
  // 我们没有实现所以先调用一下update
  function handleClick() {
    console.log("click")
    count++
    props = {}
    React.update()
  }
  return (
    <div {...props}>
      <span>count:{count}</span>
      <button onClick={handleClick}>counter</button>
    </div>
  )
}

function CounterContainer() {
  return (
    <div>
      <Counter num={12}></Counter>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <CounterContainer></CounterContainer>
    </div>
  )
}

export default App

```

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404021402616.gif)

> 这里的count为什么要写在外面呢？

我们通过`debugger`发现，执行到`updateFunctionComponent` 执行 `fiber.type(fiber.props)` 函数组件会执行一次，返回新的`props`。这是为什么`count` 要在函数外面的原因，如果写在函数里面，因为函数作用域，会取到函数内的`count`，结果是页面不会更新。

这里我们就已经实现了函数组件的事件绑定，以下是全部代码

```js
// React.js
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
        const isTextNode = typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  }

  nextWorkOfUnit = wipRoot
}

// work in progress
let wipRoot = null // 正在工作中的根节点
let currentRoot = null 
let nextWorkOfUnit = null // 下一个工作单元
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type)
}

function updateProps(dom, nextProps, prevProps) {
  // Object.keys(nextProps).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventType = key.slice(2).toLowerCase();
  //       dom.addEventListener(eventType, nextProps[key]);
  //     } else {
  //       dom[key] = nextProps[key];
  //     }
  //   }
  // });
  // {id: "1"} {}
  // 1. old 有  new 没有 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2. new 有 old 没有 添加
  // 3. new 有 old 有 修改
  Object.keys(nextProps).forEach(key => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase()

          dom.removeEventListener(eventType, prevProps[key])

          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type

    let newFiber
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      }
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: "placement",
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
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

  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))

    updateProps(dom, fiber.props, {})
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
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

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop)

function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  }

  nextWorkOfUnit = wipRoot
}

const React = {
  update,
  render,
  createElement,
}

export default React

```
今天的学习就结束了，因为这些更新其实挺复杂的，所以还是需要多理解它的思想，链表转化，以及什么时候去更新，后面我们就要学习，如何更新`children`了,大家加油


## 第五天: `update children`

### `diff - 更新 children`

### `diff - 删除多余的老节点`

### `解决 edge case 的方式`

### 优化更新 减少不必要的计算

## 第六天：搞定 `useState`

### `实现 useState`

### `批量执行 action`

### 提前检测 减少不必要的更新

## 第七天：搞定 `useEffect`

### `实现 useEffect`

### `实现 cleanup`

# 2、项目实战

## 第八天：实现 `todo-list`

### `用 mini-react 实现 todo-list`
