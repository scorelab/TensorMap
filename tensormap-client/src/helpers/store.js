import {applyMiddleware, createStore} from 'redux'
import {createLogger}                 from 'redux-logger'
import thunkMiddleware                from 'redux-thunk'
import rootReducer                    from '../reducers'

const loggerMiddleware = createLogger()

const initialState = {}

export const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)
