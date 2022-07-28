import React from 'react'
import TodoListItem from './TodoListItem'
import { shallowEqual, useSelector } from 'react-redux'

const TodoList = () => {

  const seletTodosIds = state => state.todos.map((todo) => todo.id)
  
  const todosIds = useSelector(seletTodosIds, shallowEqual)

  const renderedListItems = todosIds.map((todosId) => {
    return <TodoListItem key={todosId} id={todosId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
