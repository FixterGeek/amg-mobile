import { AsyncStorage } from 'react-native'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import eventReducer, { getEventsEpic } from './EventsDuck'
import userReducer from './UserDuck';
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import configReducer from './configDuck'
import { userLoginEpic, persistUserEpic, hydrateUserEpic } from './UserDuck'
import examReducer from './examDuck'
import paymentDuck from './paymentDuck';

let rootReducer = combineReducers({
    events: eventReducer,
    user: userReducer,
    config: configReducer,
    exam: examReducer,
    payment: paymentDuck,
})

let rootEpic = combineEpics(userLoginEpic, persistUserEpic, getEventsEpic)

let epicMiddleware = createEpicMiddleware()



export default () => {
    let store = createStore(rootReducer, {}, applyMiddleware(thunk, epicMiddleware))
    epicMiddleware.run(rootEpic)
    //looking for saved data
    AsyncStorage.getItem('event')
        .then(event => {
            if (event) {
                event = JSON.parse(event)
                store.dispatch({ type: "GET_SINGLE_EVENT_SUCCESS", payload: event })
            }
        })
    return store
}