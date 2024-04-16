import React from "../core/React.js"

function Todos() {
  const [todos, setTodos] = React.useState([])
  const [inputVal, setInputVal] = React.useState("")
  const [displayTodos, setDisplayTodos] = React.useState([])
  const [filter, setFilter] = React.useState("all")
  React.useEffect(() => {
    const rawTodos = localStorage.getItem("todos")
    if (rawTodos) {
      setTodos(JSON.parse(rawTodos))
    }
  }, [])

  // 创建todo
  function createTodo(title) {
    return { title, id: crypto.randomUUID(), status: "active" }
  }
  // 添加todo
  function addTodo(title) {
    setTodos(todos => [...todos, createTodo(title)])
  }
  // 添加按钮
  function handleAdd() {
    addTodo(inputVal)
    setInputVal("")
  }
  // 删除功能
  function removeTodo(id) {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
  }
  // 完成功能
  function doneTodo(id) {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.status = "done"
      }
      return todo
    })
    setTodos(newTodos)
  }
  // 取消功能
  function cancelTodo(id) {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.status = "active"
      }
      return todo
    })
    setTodos(newTodos)
  }
  // 保存功能
  function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos))
  }
  // 切换过滤器
  React.useEffect(() => {
    if (filter === "all") {
      setDisplayTodos(todos)
    } else {
      const newTodo = todos.filter(todo => todo.status === filter)
      setDisplayTodos(newTodo)
    }
  }, [filter, todos])
  return (
    <div>
      <h1>TODOS</h1>
      <div>
        <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button onClick={handleAdd}>add</button>
        <button onClick={saveTodo}>save</button>
      </div>
      <div>
        <input type="radio" name="filter" id="all" checked={filter === "all"} onChange={() => setFilter("all")} />
        <label htmlFor="all">all</label>
        <input
          type="radio"
          name="filter"
          id="active"
          checked={filter === "active"}
          onChange={() => setFilter("active")}
        />
        <label htmlFor="active">active</label>
        <input type="radio" name="filter" id="done" checked={filter === "done"} onChange={() => setFilter("done")} />
        <label htmlFor="done">done</label>
      </div>
      <ul>
        {...displayTodos.map(todo => {
          return <TodoItem todo={todo} removeTodo={removeTodo} cancelTodo={cancelTodo} doneTodo={doneTodo}></TodoItem>
        })}
      </ul>
    </div>
  )
}

function TodoItem({ todo, removeTodo, cancelTodo, doneTodo }) {
  return (
    <li className={todo.status}>
      <span>{todo.title}</span>
      <button
        onClick={() => {
          removeTodo(todo.id)
        }}
      >
        remove
      </button>
      <button
        onClick={() => {
          cancelTodo(todo.id)
        }}
      >
        cancel
      </button>
      <button
        onClick={() => {
          doneTodo(todo.id)
        }}
      >
        done
      </button>
    </li>
  )
}
export default Todos
