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
