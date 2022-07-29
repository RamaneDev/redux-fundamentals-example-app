import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import  ThunkMiddleware  from 'redux-thunk'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'

const composedEnhancer = composeWithDevTools(applyMiddleware(ThunkMiddleware))

const store = createStore(rootReducer, composedEnhancer)
export default store
