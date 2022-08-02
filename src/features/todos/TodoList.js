import React from 'react'
import TodoListItem from './TodoListItem'
import { useSelector } from 'react-redux'
import { selectFilteredTodoIds } from './todosSlice'

const TodoList = () => { 
  
  const todosIds = useSelector(selectFilteredTodoIds)

  const loadingStatus = useSelector(state => state.todos.status)

  if(loadingStatus === 'loading') {
    return (
      <div className='todo-list'>
        <div className='loader'></div>
      </div>
    )
  }

  const renderedListItems = todosIds.map((todosId) => {
    return <TodoListItem key={todosId} id={todosId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
