



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

然后我们就需要去修改`updateProps`

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

> type不一致的时候，删除旧的，创建新的

我写了个`demo`

```jsx
import React from "./core/React.js"

let showBar = false
function Counter() {
  const foo = <div>foo</div>
  const bar = <p>bar</p>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      <div>{showBar ? bar : foo}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App
```

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081003063.gif)

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
       if(oldFiber){
        console.log('oldFiber',oldFiber,newFiber);
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

问题出现的原因在这个方法里，我们判断type不相同的时候，出现了错误，我们打印一下，发现

![image-20240408100711855](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081007997.png)

所以我们需要记录一下我们需要删除的节点

```js
let deletions = [] // 需要删除的节点集合
function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}
function commitDeletion(fiber) {
  fiber.parent.dom.removeChild(fiber.dom)
}
```

我们在`commitRoot`去统一的处理需要删除的节点，这样一来，这个问题就解决了

但是我们这个例子不太严谨，我们把它换成函数组件

```jsx
import React from "./core/React.js"

let showBar = false
function Counter() {
  function Foo() {
    return <div>foo</div>
  }
  function Bar() {
    return <p>bar</p>
  }
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      <div>{showBar ? <Bar></Bar> : <Foo></Foo>}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App
```

这样的话，我们进行点击，就报错了

![image-20240408101756930](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081017073.png)

这里报错，肯定是因为`fiber`没值

```js
function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}
```

这里之前我们也写过这个相似的逻辑，大概就是去判断`DOM`是否存在，然后再去删除`DOM`

### `diff - 删除多余的老节点`

> 新的比老的短，需要删除多余的老节点

```jsx
import React from "./core/React.js"

let showBar = false
function Counter() {
  const foo = (
    <div>
      foo <div>child</div>
    </div>
  )
  const bar = <div>bar</div>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      <div>{showBar ? bar : foo}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App

```

运行：

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081041708.gif)

我们发现并没有正确显示出来，原因就是因为没有删除内部的子节点

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
      if (oldFiber) {
        deletions.push(oldFiber)
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
  // 如果还存在就删除掉
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}
```

我们就只需要去判断`oldFiber`还存在的话，就把它添加到删除的节点里就可以了，因为此时的`oldFiber`就是我们需要删除的节点,这里注意的是，因为可能会存在多个孩子节点，所以需要使用`while`循环，且更新`oldFiber`的值

### `解决 edge case 的方式`

我们来看一下这个`edge case`

```js
import React from "./core/React.js"

let showBar = false
function Counter() {
  const bar = <div>bar</div>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      <div>{showBar && bar}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App

```

![image-20240408111610073](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081116228.png)

我们先看一下**createElement**这个方法，我们打印一下

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        console.log("child", child)
        const isTextNode = typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}
```

![image-20240408111813716](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081118875.png)

那怎么解决呢？

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
      if (child) {
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
        deletions.push(oldFiber)
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
  // 如果还存在就删除掉
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}
```

我们需要判断一下`child`为`ture`的时候才去新增节点

我们再改一下，把内容放在里面试试

```js
import React from "./core/React.js"

let showBar = false
function Counter() {
  const bar = <div>bar</div>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }
  return (
    <div>
      counter
      {showBar && bar}
      {/* <div>{showBar && bar}</div> */}
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

export default App
```

还是报错了

![image-20240408112101238](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081121398.png)

解决：

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
      if (child) {
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
        deletions.push(oldFiber)
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
    if (newFiber) {
      prevChild = newFiber
    }
  })
  // 如果还存在就删除掉
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}
```

我们只需要判断一下`newFiber`是否存在就好了，存在的话，再去赋值`prevChild`

### `优化更新-减少不必要的计算`

> 问题：更新子组件的时候，其它不相关的组件也会重新执行，造成了浪费

```js
import React from "./core/React.js"

let countFoo1 = 1
function Foo() {
  console.log("Foo return ")
  function handleClick() {
    countFoo1++
    React.update()
  }
  return (
    <div>
      <h1>Foo : {countFoo1}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countBar = 1
function Bar() {
  console.log("Bar return ")
  function handleClick() {
    countBar++
    React.update()
  }
  return (
    <div>
      <h1>Bar : {countBar}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countApp = 1
function App() {
  console.log("App return ")
  function handleClick() {
    countApp++
    React.update()
  }
  return (
    <div>
      <h1>App : {countApp}</h1>
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}

export default App

```

以上就是测试代码，当我们点击APP的按钮的时候，发现其他的组件也会重新渲染

![image-20240408113622058](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404081136240.png)

我们来分析一下，当我们更新组件的时候，会遍历完整的树，当我们处理兄弟节点的时候，我们再去做处理

```js
let wipFiber = null // 正在工作中的 fiber
function update() {
  let currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = wipRoot
  }
}
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined
    }

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}
```

这里有一个比较厉害的点：也就是为什么要使用闭包去返回

> 闭包可以让我们在函数内部创建一个持久的引用，即使函数执行完毕，该引用仍然存在。在这种情况下，闭包被用来创建一个函数作为返回值，并且该函数引用了外部函数中的变量`currentFiber`。
>
> 在每次调用update函数时，都会创建一个新的闭包，其中的`currentFiber`变量是函数调用时的当前值。由于闭包的特性，每个闭包都会保留自己独立的`currentFiber`引用。因此，当返回的函数被调用时，它引用的`currentFiber`仍然是`update`函数调用时的那个值。
>
> 这种机制允许我们在闭包中捕获`currentFiber`的值，并在返回的函数中使用它。在当前代码中，返回的函数被赋值给了一个变量，每次调用该函数时，它会将`currentFiber`的值设置为`wipRoot`，并将`nextWorkOfUnit`设置为`wipRoot`。
>
> 总结起来，使用闭包可以让我们在返回的函数中保留对外部函数中变量的引用，以便在函数执行完毕后仍然能够访问和使用这些变量。

这样的话我们的组件也需要改一下

```jsx
import React from "./core/React.js"
let countFoo1 = 1
function Foo() {
  console.log("Foo return ")
  const update = React.update()
  function handleClick() {
    countFoo1++
    update()
  }
  return (
    <div>
      <h1>Foo : {countFoo1}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countBar = 1
function Bar() {
  console.log("Bar return ")
  const update = React.update()
  function handleClick() {
    countBar++
    update()
  }
  return (
    <div>
      <h1>Bar : {countBar}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
let countApp = 1
function App() {
  console.log("App return ")
  const update = React.update()
  function handleClick() {
    countApp++
    update()
  }
  return (
    <div>
      <h1>App : {countApp}</h1>
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}

export default App

```

这样我们就能够获取到当前调用的组件了，去比较他们的`type`是否一致，这样就不会再去触发其他的更新了

到目前为止，我们已经实现大部分了，后面两天是去学习`useState`和`useEffect`，等待下次更新

## 第六天：搞定 `useState`

### `实现 useState`

我们先写一个`demo`

```jsx
import React from "./core/React.js"
function Foo() {
  const [count, setCount] = React.useState(10)
  function handleClick() {
    setCount(pre => pre + 2)
  }
  return (
    <div>
      <h1>Foo : {count}</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <h1>App</h1>
      <Foo></Foo>
    </div>
  )
}

export default App

```

这里的话，我们先实现通过函数去实现数据更新

```js
function useState(initial) {
  let currentFiber = wipFiber
  let oldHook = currentFiber.alternate?.stateHook

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
  }

  currentFiber.stateHook = stateHook

  function setState(action) {

    stateHook.state = action(stateHook.state)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = wipRoot
  }

  return [stateHook.state, setState]
}

```

在函数内部，首先获取当前的`Fiber`节点`currentFiber`，然后尝试获取之前的钩子状态`oldHook`，如果存在的话。接着创建一个`stateHook`对象，其中的`state`属性被初始化为之前的状态或者初始值`initial`。

然后将`stateHook`对象赋值给`currentFiber`的`stateHook`属性。接下来定义了`setState`函数，它接受一个`action`作为参数，这个`action`是一个函数，用于根据当前状态计算新的状态。在`setState`函数内部，就是之前的`update`函数了。

最后，`useState`函数返回一个数组，其中第一个元素是状态的当前值，第二个元素是`setState`函数，用于更新状态。

我们可以看到，确实更新了

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404091432112.gif)



但是呢，如果我们写了多个`useState`，就会出现问题，因为我们的`oldHook`是一个变量，所以我们需要用数组来存储

```jsx
import React from "./core/React.js"
function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState("bar")
  function handleClick() {
    setCount(pre => pre + 2)
    setBar(pre => pre + "bar")
  }
  return (
    <div>
      <h1>Foo : {count}</h1>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <h1>App</h1>
      <Foo></Foo>
    </div>
  )
}

export default App

```

```js
let stateHooks
let stateHookIndex
function useState(initial) {
  let currentFiber = wipFiber
  let oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
  }
  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks

  function setState(action) {
    stateHook.state = action(stateHook.state)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = wipRoot
  }

  return [stateHook.state, setState]
}
```

我们这里通过设置`stateHooks`变量去存储`stateHook`,并且设置`stateHookIndex`索引来获取老的值，这样就不会影响下次更新了，这也是为什么`useState`必须写在顶层，不能用`if`语句去包裹的原因,

这里需要注意的是，每次更新后，需要把值清空

```js
function updateFunctionComponent(fiber) {
  stateHooks = []
  stateHookIndex = 0
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}
```

这样一来我们就已经完成了`useState`

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404091444366.gif)

### `批量执行 action`

上一节我们写的方法，其实是每次触发`useState`的`action`的时候，都会更新一下视图，这样是不太好的，会造成性能上的浪费，所以，这一节我们来实现一下`useState`的批处理

```js
let stateHooks
let stateHookIndex
function useState(initial) {
  let currentFiber = wipFiber
  let oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  }
  // 调用action
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })
  stateHook.queue = []

  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks

  function setState(action) {
    stateHook.queue.push(typeof action === "function" ? action : () => action)
    // stateHook.state = action(stateHook.state)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = wipRoot
  }

  return [stateHook.state, setState]
}
```

这里我们加入一个`queue`来存储`action`，并循环去执行`action`，这样就实现了把多次`action`的操作，转化成一次去执行。

我们还去判断了一下`action`的类型，如果不是函数，那么我们就包装成一个函数，这样我们就实现了直接输入值的情况。

### `提前检测-减少不必要的更新`

当值没有发生改变的时候，我们应该不需要去更新组件

```js
import React from "./core/React.js"
function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState("bar")
  function handleClick() {
    setBar(pre => "bar")
  }
  return (
    <div>
      <h1>Foo : {count}</h1>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <h1>App</h1>
      <Foo></Foo>
    </div>
  )
}

export default App

```

我们只需要去判断一下值是否相等就行了！！！

```js
let stateHooks
let stateHookIndex
function useState(initial) {
  let currentFiber = wipFiber
  let oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  }
  // 调用action
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })
  stateHook.queue = []

  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks

  function setState(action) {
    // 处理值一样的情况
    const eagerState = typeof action === "function" ? action(stateHook.state) : action
    if (eagerState === stateHook.state) return

    stateHook.queue.push(typeof action === "function" ? action : () => action)
    // stateHook.state = action(stateHook.state)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }

    nextWorkOfUnit = wipRoot
  }

  return [stateHook.state, setState]
}
```

到目前为止，我们已经完成了`useState`的方法了，下一期将进入`useEffect`的学习

## 第七天：搞定 `useEffect`

### `实现 useEffect`

我们先来看看怎么使用

```js
// useEffect
// 调用时机是在 React 完成对 DOM 的渲染之后，并且在浏览器完成绘制之前
useEffect(() => {
    console.log("init")
}, [])

useEffect(() => {
    console.log("init")
}, [count])
```

`useEffect` 接收两个参数，一个`callback`，和一个`deps`，当`deps`是空的时候，相当于初始化，如果有依赖项，会在依赖项发生变化的时候再次调用一次

接下来我们先试试怎么实现

```jsx
import React from "./core/React.js"

// useEffect
// 调用时机是在 React 完成对 DOM 的渲染之后，并且在浏览器完成绘制之前

function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState("bar")
  function handleClick() {
    setCount(c => c + 1)
    setBar(() => "bar")
  }

  React.useEffect(() => {
    console.log("init")
  }, [])

  return (
    <div>
      <h1>Foo : {count}</h1>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <h1>App</h1>
      <Foo></Foo>
    </div>
  )
}

export default App

```

我们来创建一个`useEffect`函数,并导出

这里的话，我们还是跟useState一样，我们定义一个`effectHook`,把它存在我们的`Fiber`节点中

```js
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
  }

  wipFiber.effectHook = effectHook
}

const React = {
  update,
  render,
  createElement,
  useState,
  useEffect,
}
```

然后我们应该在那去调用呢，看看调用时机，时机应该在 `React` 完成对 `DOM` 的渲染之后

所以我们应该在`commitWork`调用完再去调用,我们写一个方法`commitEffectHook`,然后调用它，这里因为需要处理子节点和兄弟节点，所以我们需要递归去调用它

```js
function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  commitEffectHook()
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}
function commitEffectHook() {
  function run(fiber) {
    if (!fiber) return
    fiber.effectHook?.callback()
    run(fiber.child)
    run(fiber.sibling)
  }
  run(wipRoot)
}
```

运行我们看一下

![image-20240416101248209](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161012357.png)

可以看到，确实执行了，接下来我们加上依赖项

```js
  React.useEffect(() => {
    console.log("init")
  }, [count])
```

这里我们先判断是不是初始化还是`update`，可以通过之前的`alternate`字段来判断，有值的话就是`update`，在更新的时候，我们需要判断`deps`有没有更新，有更新的话，我们才去执行`callback`

```js
function commitEffectHook() {
  function run(fiber) {
    if (!fiber) return
    if (!fiber.alternate) {
      // 初始化
      fiber.effectHook?.callback()
    } else {
      // update  需要去检测deps有没有更新
      const oldEffectHook = fiber.alternate?.effectHook

      const needUpdate = oldEffectHook?.deps.some((oldDep, index) => {
        return oldDep !== fiber.effectHook?.deps[index]
      })

      if (needUpdate) {
        fiber.effectHook?.callback()
      }
    }
    run(fiber.child)
    run(fiber.sibling)
  }
  run(wipRoot)
}
```

我们来试试效果

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161019235.gif)

确实可以正常执行了，那如果有多个`useEffect`怎么处理呢

```jsx
  React.useEffect(() => {
    console.log("init")
  }, [])

  React.useEffect(() => {
    console.log("update", count)
  }, [count])
```

先看看实现，定义一个`effectHooks`去存多个`useEffect`，然后放到`effectHooks`这个属性上，初始化的时候，应该是在初始化`functionComponent`上的，所以我们也加一下；然后就是处理内部了，循环`effectHooks`去执行里面的`callback`,这个流程跟`useState`的处理很类似

```js
let effectHooks
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
  }
  effectHooks.push(effectHook)
  wipFiber.effectHooks = effectHooks
}

function updateFunctionComponent(fiber) {
  stateHooks = []
  effectHooks = []
  stateHookIndex = 0
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}

function commitEffectHook() {
  function run(fiber) {
    if (!fiber) return
    if (!fiber.alternate) {
      // 初始化
      fiber.effectHooks?.forEach(hook => hook?.callback())
    } else {
      // update  需要去检测deps有没有更新

      fiber.effectHooks?.forEach((newHook, index) => {
        const oldEffectHook = fiber.alternate?.effectHooks[index]

        const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
          return oldDep !== newHook.deps[i]
        })

        needUpdate && newHook.callback()
      })
    }
    run(fiber.child)
    run(fiber.sibling)
  }
  run(wipRoot)
}
```

之后我们试试效果怎么样？

![image-20240416102938420](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161029573.png)

可以看到，点击的时候只触发了`update`的`callback `

最终代码,我们就加了个判断，当`deps`不为空的时候再去执行比较

```js
function commitEffectHook() {
  function run(fiber) {
    if (!fiber) return
    if (!fiber.alternate) {
      // 初始化
      fiber.effectHooks?.forEach(hook => hook?.callback())
    } else {
      // update  需要去检测deps有没有更新

      fiber.effectHooks?.forEach((newHook, index) => {
        if (newHook.deps.length > 0) {
          const oldEffectHook = fiber.alternate?.effectHooks[index]

          const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
            return oldDep !== newHook.deps[i]
          })

          needUpdate && newHook.callback()
        }
      })
    }
    run(fiber.child)
    run(fiber.sibling)
  }
  run(wipRoot)
}
```

### `实现 cleanup`

首先我们来了解一下`cleanUp`的机制

`cleanUp` 函数会在组件卸载的时候执行 在调用`useEffect`之前进行调用 ，当`deps` 为空的时候不会调用返回的`cleanUp `

我写了一个`demo`文件，我们可以看看它应该如何打印呢

1. `deps`为空的时候，它的`cleanUp`是不会调用的
2. 当`deps`不为空的时候，执行下一次的`useEffect`的时候之前会先执行一下`cleanUp`函数

```jsx
import React from "./core/React.js"

// useEffect
// 调用时机是在 React 完成对 DOM 的渲染之后，并且在浏览器完成绘制之前
// cleanUp 函数会在组件卸载的时候执行 在调用useEffect之前进行调用 ，当deps 为空的时候不会调用返回的cleanup

function Foo() {
  const [count, setCount] = React.useState(10)
  const [bar, setBar] = React.useState("bar")
  function handleClick() {
    setCount(c => c + 1)
    setBar(() => "bar")
  }
  React.useEffect(() => {
    console.log("init")
    return () => {
      console.log("cleanUp 0")
    }
  }, [])

  React.useEffect(() => {
    console.log("update", count)
    return () => {
      console.log("cleanUp 1")
    }
  }, [count])

  React.useEffect(() => {
    console.log("update", count)
    return () => {
      console.log("cleanUp 2")
    }
  }, [count])

  return (
    <div>
      <h1>Foo : {count}</h1>
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}
function App() {
  return (
    <div>
      <h1>App</h1>
      <Foo></Foo>
    </div>
  )
}

export default App

```

实现:

首先我们存一个`cleanUp`属性,然后我们去执行`hook`的`callback`的时候，需要把结果放在`hook`的`cleanUp`属性上，接下来我们就可以去执行了；

我们先创建一个方法，跟run类似，我们叫做`runCleanUp`吧，注意我们这里只需要当`deps`的`length`大于0的时候才去执行

```js
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanUp: undefined,
  }
  effectHooks.push(effectHook)
  wipFiber.effectHooks = effectHooks
}

function commitEffectHook() {
  function run(fiber) {
    if (!fiber) return
    if (!fiber.alternate) {
      // 初始化
      fiber.effectHooks?.forEach(hook => {
        hook.cleanUp = hook?.callback()
      })
    } else {
      // update  需要去检测deps有没有更新

      fiber.effectHooks?.forEach((newHook, index) => {
        if (newHook.deps.length > 0) {
          const oldEffectHook = fiber.alternate?.effectHooks[index]

          const needUpdate = oldEffectHook?.deps.some((oldDep, i) => {
            return oldDep !== newHook.deps[i]
          })

          needUpdate && (newHook.cleanUp = newHook.callback())
        }
      })
    }
    run(fiber.child)
    run(fiber.sibling)
  }
  function runCleanUp(fiber) {
    if (!fiber) return
    fiber.alternate?.effectHooks?.forEach(hook => {
      if (hook?.deps.length > 0) {
        hook?.cleanUp && hook?.cleanUp()
      }
    })
    runCleanUp(fiber.child)
    runCleanUp(fiber.sibling)
  }
  runCleanUp(wipRoot)
  run(wipRoot)
}
```

我们来看看页面效果

![image-20240416105941481](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161059644.png)

可以看到，`deps`为空的时候不会调用`cleanUp`函数了，到目前为止，我们就已经完成所有的`React`任务，后面的就是用我们写的`React`源码去实战一个`todoList`

等待下次更新吧,`xdm`~~~

# 2、项目实战

## 第八天：实现 `todo-list`

### `用 mini-react 实现 todo-list`

我们先来实现静态页面，然后再去实现事件相关

我们先创建一个文件夹`src`，`src`里有个`Todos.jsx`

```js
import React from "../core/React.js"

function Todos() {
  const todos = [
    {
      title: "吃饭",
    },
    {
      title: "喝水",
    },
    {
      title: "写代码",
    },
  ]
  return (
    <div>
      <h1>TODOS</h1>
      <div>
        <input type="text" />
        <button>ADD</button>
      </div>
      <ul>
        {...todos.map(todo => {
          return <li>{todo.title}</li>
        })}
      </ul>
    </div>
  )
}

export default Todos
```

然后我们导入一下，这里注意，因为是`jsx`文件，需要去获取一下`React`这个方法，所以我们一般都需要手动导入一下

```js
import React from "./core/React.js"

import Todos from "./src/Todos.jsx"

function App() {
  return (
    <div>
      <Todos />
    </div>
  )
}

export default App

```

运行一下，没有什么问题

![image-20240416153929707](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161539789.png)

接下来就直接上代码吧,这里增加了添加，删除，取消，完成这四个功能

```js
import React from "../core/React.js"

function Todos() {
  const [todos, setTodos] = React.useState([
    {
      title: "吃饭",
      id: crypto.randomUUID(),
      status: "active",
    },
    {
      title: "喝水",
      id: crypto.randomUUID(),
      status: "done",
    },
    {
      title: "写代码",
      id: crypto.randomUUID(),
      status: "done",
    },
  ])
  const [inputVal, setInputVal] = React.useState("")

  // 添加todo
  function addTodo(title) {
    setTodos(todos => [...todos, { title }])
  }
  // 添加按钮
  function handleAdd() {
    addTodo(inputVal)
    setInputVal("")
  }
  // 删除功能
  function removeTodo(id) {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
  }
  // 完成功能
  function doneTodo(id) {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.status = "done"
      }
      return todo
    })
    setTodos(newTodos)
  }
  // 取消功能
  function cancelTodo(id) {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.status = "active"
      }
      return todo
    })
    setTodos(newTodos)
  }
  return (
    <div>
      <h1>TODOS</h1>
      <div>
        <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button onClick={handleAdd}>ADD</button>
      </div>
      <ul>
        {...todos.map(todo => {
          return <TodoItem todo={todo} removeTodo={removeTodo} cancelTodo={cancelTodo} doneTodo={doneTodo}></TodoItem>
        })}
      </ul>
    </div>
  )
}

function TodoItem({ todo, removeTodo, cancelTodo, doneTodo }) {
  return (
    <li className={todo.status}>
      <span>{todo.title}</span>
      <button
        onClick={() => {
          removeTodo(todo.id)
        }}
      >
        remove
      </button>
      <button
        onClick={() => {
          cancelTodo(todo.id)
        }}
      >
        cancel
      </button>
      <button
        onClick={() => {
          doneTodo(todo.id)
        }}
      >
        done
      </button>
    </li>
  )
}
export default Todos

```

并且我们在`style.css`中新加了样式

```css
.done {
  text-decoration: line-through;
  font-weight: 1000;
}
.active {
  color: red;
}
button {
  margin-left: 10px;
}
```

引入样式

```js
import React from "./core/React.js"

import Todos from "./src/Todos.jsx"
import "./style.css"

function App() {
  return (
    <div>
      <Todos />
    </div>
  )
}

export default App

```

当我们运行的时候，发现事件不好使了，通过`debugger`，我们发现在更新的时候我们去判断一下`fiber.dom`存在

```js
function commitWork(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === "update" && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```

修改完后，运行执行,按钮功能也是运行成功了！

![image-20240416161105936](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161611029.png)

接下来我们继续增加了一些功能,例如保存数据、切换数据，并且我们还使用了`useEffect`去初始化数据，已经去判断当`radio`切换时，切换数据

以下是完整代码：

```js
import React from "../core/React.js"

function Todos() {
  const [todos, setTodos] = React.useState([])
  const [inputVal, setInputVal] = React.useState("")
  const [displayTodos, setDisplayTodos] = React.useState([])
  const [filter, setFilter] = React.useState("all")
  React.useEffect(() => {
    const rawTodos = localStorage.getItem("todos")
    if (rawTodos) {
      setTodos(JSON.parse(rawTodos))
    }
  }, [])

  // 创建todo
  function createTodo(title) {
    return { title, id: crypto.randomUUID(), status: "active" }
  }
  // 添加todo
  function addTodo(title) {
    setTodos(todos => [...todos, createTodo(title)])
  }
  // 添加按钮
  function handleAdd() {
    addTodo(inputVal)
    setInputVal("")
  }
  // 删除功能
  function removeTodo(id) {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
  }
  // 完成功能
  function doneTodo(id) {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.status = "done"
      }
      return todo
    })
    setTodos(newTodos)
  }
  // 取消功能
  function cancelTodo(id) {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.status = "active"
      }
      return todo
    })
    setTodos(newTodos)
  }
  // 保存功能
  function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos))
  }
  // 切换过滤器
  React.useEffect(() => {
    if (filter === "all") {
      setDisplayTodos(todos)
    } else {
      const newTodo = todos.filter(todo => todo.status === filter)
      setDisplayTodos(newTodo)
    }
  }, [filter, todos])
  return (
    <div>
      <h1>TODOS</h1>
      <div>
        <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button onClick={handleAdd}>add</button>
        <button onClick={saveTodo}>save</button>
      </div>
      <div>
        <input type="radio" name="filter" id="all" checked={filter === "all"} onChange={() => setFilter("all")} />
        <label htmlFor="all">all</label>
        <input
          type="radio"
          name="filter"
          id="active"
          checked={filter === "active"}
          onChange={() => setFilter("active")}
        />
        <label htmlFor="active">active</label>
        <input type="radio" name="filter" id="done" checked={filter === "done"} onChange={() => setFilter("done")} />
        <label htmlFor="done">done</label>
      </div>
      <ul>
        {...displayTodos.map(todo => {
          return <TodoItem todo={todo} removeTodo={removeTodo} cancelTodo={cancelTodo} doneTodo={doneTodo}></TodoItem>
        })}
      </ul>
    </div>
  )
}

function TodoItem({ todo, removeTodo, cancelTodo, doneTodo }) {
  return (
    <li className={todo.status}>
      <span>{todo.title}</span>
      <button
        onClick={() => {
          removeTodo(todo.id)
        }}
      >
        remove
      </button>
      <button
        onClick={() => {
          cancelTodo(todo.id)
        }}
      >
        cancel
      </button>
      <button
        onClick={() => {
          doneTodo(todo.id)
        }}
      >
        done
      </button>
    </li>
  )
}
export default Todos

```

运行一下，非常完美

![动画](https://gitee.com/nest-of-old-time/picture/raw/master/typora/202404161641351.gif)

在执行`useEffect`初始化的时候有一个错误，解决方法是

在`useEffect`的`deps`为空时，当数据发生改变也需要重新渲染视图

```js
function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined
    }

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  if (nextWorkOfUnit && !wipRoot) {
    wipRoot = currentRoot
  }

  requestIdleCallback(workLoop)
}
```

到目前为止，所有的功能就完成，非常感谢大家的阅读和喜欢，后面我还会继续努力，去分享更多技术的

以下是代码仓库，已经分类到每一天了
