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
