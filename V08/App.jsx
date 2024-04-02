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
