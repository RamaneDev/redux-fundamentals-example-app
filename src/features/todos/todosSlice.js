import { createSelector } from 'reselect'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status:'idle',
  entities:[]
}

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export const selectTodoIds = createSelector(
  state => state.todos,
  todos => todos.map(todo => todo.id)
)

export const selectTodos = state => state.todos.entities

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  state => state.filters,
  // Output selector: receives both values
  (entities, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {      
      return entities
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return entities.filter(todo => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)


export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filtredTodos => filtredTodos.map(todo => todo.id)
)


export const todoAdded = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo
  }
}

// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })   
    dispatch(todoAdded(response.todo))
  }
}

export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}


export const colorChanged = (color, todoId) => {
  return {
    type:'todos/colorSelected',
    payload: {color, todoId}
  }
}

export const todosLoading = () => {
  return {
    type: 'todos/todosLoading',
    payload: []
  }
}

// Thunk function
export async function fetchTodos(dispatch, getState) {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return {
        ...state, 
        entities:[...state.entities, action.payload]
      }
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading'
      }
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        entities: state.entities.map(todo => {
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed
          }
        })
      }
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload

   
      const newEntities = state.entities.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          color:color,
        }
      }) 

      return {
        ...state,      
        entities: newEntities
      }
    }
    case 'todos/todosLoaded': {
      return {
        ...state,
        status: 'idle',
        entities: action.payload
      }
    }
    case 'todos/todoDeleted': {
      return state.filter((todo) => todo.id !== action.payload)
    }
    case 'todos/allCompleted': {
      return state.map((todo) => {
        return { ...todo, completed: true }
      })
    }
    case 'todos/completedCleared': {
      return state.filter((todo) => !todo.completed)
    }
    default:
      return state
  }
}
