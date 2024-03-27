

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

首先认识一下什么是`fiber`架构：

`Fiber` 架构是一种用于构建用户界面的 React 应用程序的新架构。它是 React 16 版本中引入的一项重要功能。

在传统的 React 架构中，React 使用了一种称为“协调”（Reconciliation）的机制来处理组件的更新和渲染。这种机制是基于递归的，意味着 React 会从根组件开始递归地遍历整个组件树，以确定哪些组件需要更新，并最终进行渲染。这种递归的算法在处理大型组件树或复杂的交互式用户界面时可能会导致性能问题。

`Fiber` 架构的目标是改进 React 的协调机制，以提高性能和用户体验。它引入了一种新的数据结构，称为 `Fiber`。`Fiber` 是一个轻量级的 JavaScript 对象，用于表示组件树中的每个组件和其相关的信息。

`Fiber` 架构使用了一种称为“时间切片”（Time Slicing）的技术，将组件的更新工作分解为多个小任务，并使用优先级调度算法来决定哪些任务应该优先执行。这样可以使 React 在处理大型组件树时更加灵活和高效，提高了应用程序的响应能力和性能。

通过引入 `Fiber` 架构，React 可以在每个任务之间进行中断和恢复，从而实现更好的并发和交互式体验。它还为 React 引入了一些新的功能，例如异步渲染、增量渲染和错误边界等。

总的来说，`Fiber` 架构是 React 的一种新的渲染引擎，旨在提高性能、并发能力和用户体验。它是 React 生态系统中的重要进步之一，为构建现代 Web 应用程序提供了更好的基础。

## 第三天：统一提交 & 实现 `Function Component`

### 实现统一提交

### 实现 `Function Component`

### 重构 `Function Component`

## 第四天：进军 `vdom` 的更新

### 实现事件绑定

### 实现更新 `props`

### 重构 `props`

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