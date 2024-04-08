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
