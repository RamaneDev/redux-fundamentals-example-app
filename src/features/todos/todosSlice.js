const initialState = [
    { id: 0, text: 'Learn React', completed: true },
    { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
  ]
  
  function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
  }
  
  export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            // We need to return a new state object
            return {
              // that has all the existing state data
              ...state,
              // but has a new array for the `todos` field
              todos: [
                // with all of the old todos
                ...state.todos,
                // and the new todo object
                {
                  // Use an auto-incrementing numeric ID for this example
                  id: nextTodoId(state.todos),
                  text: action.payload,
                  completed: false
                }
              ]
            }
          }
    
          case 'todos/todoToggled': {
            return {
              // Again copy the entire state object
              ...state,
              // This time, we need to make a copy of the old todos array
              todos: state.todos.map(todo => {
                // If this isn't the todo item we're looking for, leave it alone
                if (todo.id !== action.payload) {
                  return todo
                }
      
                // We've found the todo that has to change. Return a copy:
                return {
                  ...todo,
                  // Flip the completed flag
                  completed: !todo.completed
                }
              })
            }
          }
      default:
        return state
    }
  }