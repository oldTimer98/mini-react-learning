// v1
// const dom = document.createElement("div")
// dom.id = "app"
// document.querySelector("#root").append(dom)
// const textNode = document.createTextNode("")
// textNode.nodeValue = "app"
// dom.appendChild(textNode)

// v2
// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "app",
//     children: [],
//   },
// }
// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: [textEl],
//   },
// }
// const dom = document.createElement(el.type)
// dom.id = el.props.id
// document.querySelector("#root").append(dom)
// const textNode = document.createTextNode("")
// textNode.nodeValue = textEl.props.nodeValue
// dom.appendChild(textNode)

// v3
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

const textEl = createTextNode("app")
// const App = createElement("div", { id: "app" }, textEl)
const App = createElement("div", { id: "app" }, "hi-", "mini-react")
// render(App, document.querySelector("#root"))

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
