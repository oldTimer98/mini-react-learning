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

  React.useEffect(() => {
    console.log("update", count)
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
