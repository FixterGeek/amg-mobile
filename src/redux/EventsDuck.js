import { combineReducers } from 'redux'
import axios from 'axios'
import { AsyncStorage } from 'react-native'
import { ofType } from 'redux-observable';
import {
    withLatestFrom,
    pluck,
    ignoreElements,
    switchMap,
    catchError,
    map,
    tap
} from 'rxjs/operators'
import { concat, of, EMPTY } from 'rxjs'
import { ajax } from 'rxjs/ajax'


let baseURL = "https://amg-api.herokuapp.com/"

let initialState = {
    status: "idle", // idle || fetching || success || error
    fetching: false,
    error: null,
    array: [],
    currentEvent: {
        fetching: false
    },
    currentActivity: {
        speaker: {}
    }
}

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
const GET_EVENTS = "GET_EVENTS"
const GET_EVENTS_ERROR = "GET_EVENTS_ERROR"
const GET_SINGLE_EVENT = "GET_SINGLE_EVENT"
const GET_SINGLE_EVENT_SUCCESS = "GET_SINGLE_EVENT_SUCCESS"
const GET_SINGLE_EVENT_ERROR = "GET_SINGLE_EVENT_ERROR"
const SET_CURRENT_EVENT = "SET_CURRENT_EVENT"
const SET_CURRENT_ACTIVITY = "SET_CURRENT_ACTIVITY"


//actions

export function setCurrentActivity(activity) {
    return {
        type: SET_CURRENT_ACTIVITY,
        payload: activity
    }
}
export function getEvents() {
    return {
        type: GET_EVENTS
    }
}
export function getEventsSuccess(events) {
    return {
        type: GET_EVENTS_SUCCESS,
        payload: events
    }
}

function getEventsError(name) {
    return {
        type: GET_EVENTS_ERROR,
        payload: name
    }
}

function getSingleEventSuccess(event) {
    return {
        type: GET_SINGLE_EVENT_SUCCESS,
        payload: event
    }
}

function getSingleEventError(err) {
    return {
        type: GET_SINGLE_EVENT_ERROR,
        payload: err
    }
}
function getSingleEvent() {
    return {
        type: GET_SINGLE_EVENT
    }
}

// function setCurrentEvent(event) {
//     return {
//         type: SET_CURRENT_EVENT,
//         payload: event
//     }
// }

// reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_ACTIVITY:
            return { ...state, currentActivity: { ...action.payload } }
        case GET_EVENTS_ERROR:
            return { ...state, status: "error", fetching: false, error: action.payload }
        case GET_EVENTS:
            return { ...state, status: "fetching", fetching: true }
        case GET_EVENTS_SUCCESS:
            return { ...state, array: [...action.payload], fetching: false, status: "success" }
        case GET_SINGLE_EVENT:
            return { ...state, currentEvent: { fetching: true } }
        case GET_SINGLE_EVENT_ERROR:
            return { ...state, currentEvent: { error: action.payload, fetching: false } }
        case GET_SINGLE_EVENT_SUCCESS:
            return { ...state, currentEvent: { ...action.payload, fetching: false, status: "success" } }
        case SET_CURRENT_EVENT:
            return { ...state, currentEvent: { ...action.payload, fetching: false } }
        default:
            return state
    }
}

// action creators

// thunks 


export let setCurrentActivityAction = (activity) => (dispatch) => {
    if (Object.values(activity).length < 2) {
        AsyncStorage.getItem('activity')
            .then(string => {
                if (string) dispatch(setCurrentActivity(JSON.parse(string)))
            })
    } else {
        AsyncStorage.setItem('activity', JSON.stringify(activity))
        dispatch(setCurrentActivity(activity))
    }

}

export let getSingleEventAction = (_id) => (dispatch, getState) => {
    dispatch(getSingleEvent())
    let { user: { token } } = getState()
    return axios.get(baseURL + "events/" + _id, { headers: { Authorization: token } })
        .then(res => {
            AsyncStorage.setItem('event', JSON.stringify(res.data))
            dispatch(getSingleEventSuccess(res.data))
        })
        .catch(err => {
            dispatch(getSingleEventError(err.response.data))
        })
}
// observable
//EPICS

export function getEventsEpic(action$, state$) {
    return action$.pipe(
        ofType(GET_EVENTS),
        withLatestFrom(state$.pipe(pluck('user'))),
        switchMap(([action, { token }]) => {
            //console.log("token: ", token)
            return concat(
                ajax.get(baseURL + 'events?query={"status":"published"}', { 'Content-Type': 'application/json', "Authorization": token }).pipe(
                    map(res => {
                        //console.log("res: ", res.response)
                        return getEventsSuccess([...res.response])
                    }),
                    catchError(err => {
                        console.log("error", err)
                        return of(getEventsError(err.response.name))
                    })
                )

            )
        })
    )
}


export default reducer