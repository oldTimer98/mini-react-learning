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
