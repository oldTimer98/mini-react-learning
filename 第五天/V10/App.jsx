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
