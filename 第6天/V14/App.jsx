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
