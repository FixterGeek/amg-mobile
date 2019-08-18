import { combineReducers } from 'redux'
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
import axios from 'axios'

let baseURL = "https://amg-api.herokuapp.com/"

let initialState = {
    error: null,
    fetching: false,
    status: "logedOut", // logedOut || fetching || success ||
    loggedIn: false
}

//constants
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const TRY_LOGIN = "TRY_LOGIN"
const LOGIN_ERROR = "LOGIN_ERROR"

const UPDATE_USER = "UPDATE_USER"
const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS"
const UPDATE_USER_ERROR = "UPDATE_USER_ERROR"

const SUBSCRIBE_TO_EVENT = "SUBSCRIBE_TO_EVENT"
const SUBSCRIBE_TO_EVENT_SUCCESS = "SUBSCRIBE_TO_EVENT_SUCCESS"
const SUBSCRIBE_TO_EVENT_ERROR = "SUBSCRIBE_TO_EVENT_ERROR"

const SUBSCRIBE_TO_ACTIVITY = "SUBSCRIBE_TO_ACTIVITY"
const SUBSCRIBE_TO_ACTIVITY_SUCCESS = "SUBSCRIBE_TO_ACTIVITY_SUCCESS"
const SUBSCRIBE_TO_ACTIVITY_ERROR = "SUBSCRIBE_TO_ACTIVITY_ERROR"


//actionCreators
export let subscribeToActivitySuccess = (activity) => ({ type: SUBSCRIBE_TO_ACTIVITY_SUCCESS, payload: activity })
export let subscribeToActivityError = (err) => ({ type: SUBSCRIBE_TO_ACTIVITY_ERROR, payload: err })
export let subscribeToEventSuccess = (event) => ({ type: SUBSCRIBE_TO_EVENT_SUCCESS, payload: event })
export let subscribeToEventError = (err) => ({ type: SUBSCRIBE_TO_EVENT_ERROR, payload: err })


export function tryLogin(auth) {
    return {
        type: TRY_LOGIN,
        payload: auth
    }
}
export function loginSuccess(user) {
    return {
        type: LOGIN_SUCCESS,
        payload: user
    }
}

export function loginUserError(error) {
    return {
        type: LOGIN_ERROR,
        payload: error
    }
}

// reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case SUBSCRIBE_TO_EVENT:
            return { ...state, fetching: true, status: "fetching" }
        case SUBSCRIBE_TO_EVENT_SUCCESS:
            return { ...state, assistedEvents: [action.payload, ...state.assistedEvents], status: "success" }
        case SUBSCRIBE_TO_EVENT_ERROR:
            return { ...state, error: action.payload, status: "error" }

        case SUBSCRIBE_TO_ACTIVITY:
            return { ...state, fetching: true, status: "fetching" }
        case SUBSCRIBE_TO_ACTIVITY_SUCCESS:
            let u = { ...state, assistedActivities: [action.payload, ...state.assistedActivities], status: "success" }
            console.log("suscrito:", u)
            return { ...u }
        case SUBSCRIBE_TO_ACTIVITY_ERROR:
            return { ...state, error: action.payload, status: "error" }

        case UPDATE_USER:
            return { ...state, status: "fetching", fetching: true }
        case LOGIN_SUCCESS:
            return { loggedIn: true, ...action.payload, status: "success", fetching: false }
        case TRY_LOGIN:
            return { fetching: true, status: "fetching" }
        case "LOGIN_ERROR":
            return { ...state, fetching: false, status: "idle", error: action.payload }
        case "LOG_OUT":
            return { ...initialState }
        case "SET_STATUS":
            return { ...state, status: action.payload }
        default:
            return state
    }
}

// action creators
export let subscribeToEventAction = (eventId) => (dispatch, getState) => {
    let { user: { token } } = getState()
    return axios.post(baseURL + `events/${eventId}/assist`, {}, { headers: { Authorization: token } })
        .then(res => {
            dispatch(subscribeToEventSuccess(res.data))
            return res.data
        })
        .catch(e => {
            dispatch(subscribeToEventError(e.response.data.message))
            return e
        })
}
export let subscribeToActivityAction = (activityId) => (dispatch, getState) => {
    dispatch({ type: SUBSCRIBE_TO_ACTIVITY })
    let { user: { token } } = getState()
    console.log("token ", token)
    console.log("id ", activityId)
    return axios.post(baseURL + `eventActivities/${activityId}/assist`, {}, { headers: { Authorization: token } })
        .then(res => {
            console.log("data: ", res.data)
            dispatch(subscribeToActivitySuccess(res.data))
            return res.data
        })
        .catch(e => {
            console.log(e)
            console.log(e.response.data.message)
            dispatch(subscribeToActivityError(e.response.data.message))
            return e
        })
}

// thunks
// export function updateUserAction(formData){
//     return (dispatch, getState)=>{
//         let user = getState().user
//         dispatch({type:UPDATE_USER})
//         return axios.patch(baseURL + `/${user._id}`,formData, {headers:{Authorization:user.token}})
//         .then()
//         .catch()
//     }
// }

export function signOutAction() {
    return (dispatch) => {
        AsyncStorage.multiRemove(['userData', "token"])
        dispatch({ type: "LOG_OUT" })
    }
}

//epics
export async function hydrateUserEpic(action$, state$) {

    return Promise.all([AsyncStorage.getItem('userData'), AsyncStorage.getItem('token')])
        .then(([user, token]) => {

            if (typeof user === "string" && typeof token === "string") {
                try {
                    let parsedUser = JSON.parse(user)
                    let parsedToken = JSON.parse(token)
                    return of(loginSuccess(user))
                } catch (e) {
                    return EMPTY
                }
            }
            return EMPTY
        })



}
export function persistUserEpic(action$, state$) {
    return action$.pipe(
        ofType(LOGIN_SUCCESS),
        withLatestFrom(state$.pipe(pluck("user"))),
        tap(([action, user]) => {
            AsyncStorage.setItem('userData', JSON.stringify(user))
            AsyncStorage.setItem('token', user.token)
        }),
        ignoreElements() // llamar eventos
    )
}
export function userLoginEpic(action$, state$) {
    return action$.pipe(
        ofType(TRY_LOGIN),
        withLatestFrom(state$.pipe(pluck('config'))),
        switchMap(([action, { baseURL }]) => {
            return concat(
                ajax.post(baseURL + "auth/login", action.payload, { 'Content-Type': 'application/json' }).pipe(
                    map(res => {
                        return loginSuccess({ ...res.response.user, token: res.response.token })
                    }),
                    catchError(err => {
                        console.log("error", err)
                        return of(loginUserError(err.response.name))
                    })
                )

            )
        })
    )
}

export default reducer