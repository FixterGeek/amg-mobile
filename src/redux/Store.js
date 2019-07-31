import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import eventReducer from './EventsDuck'
import userReducer from './UserDuck'

let initialState = {
    events: {
        array: []
    },
    user: {}
}

let rootReducer = combineReducers({
    events: eventReducer,
    user: userReducer
})

export default () => (
    createStore(rootReducer, initialState, applyMiddleware(thunk))
)