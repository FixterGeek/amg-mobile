import { combineReducers } from 'redux'

// reducer
function array(state = {}, action) {
    switch (action.type) {
        case "SAVE_USER_DATA":
            return action.payload
        case "":
        default:
            return state
    }
}

// action creators

// thunks 
// observable

export default combineReducers({ array })