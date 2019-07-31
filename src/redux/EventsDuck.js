import { combineReducers } from 'redux'
import axios from 'axios'
import { AsyncStorage } from 'react-native'

let url = "https://amg-api.herokuapp.com/events"
//token
function getConfig(token) {
    return {
        headers: {
            "Authorization": token
        }
    }
}
function getToken() {
    return AsyncStorage.getItem('token')
}

// constants
const GET_EVENTS_SUCCESS = "GET_EVENTS_SUCCESS"

// reducer
function array(state = [], action) {
    switch (action.type) {
        case GET_EVENTS_SUCCESS:
            return action.payload
        case "GET_SINGLE_EVENT":
        default:
            return state
    }
}

// action creators

// thunks 
export let getEvents = () => (dispatch) => {
    return getToken()
        .then(token => {
            return axios.get(url, getConfig(token))
        })
        .then(res => {
            dispatch({ type: GET_EVENTS_SUCCESS, payload: res.data })
            return res
        })
        .catch(e => console.log("Errorr:", e))
}
// observable

export default combineReducers({ array })