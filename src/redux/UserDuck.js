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

let initialState = {
    error: null,
    fetching: false,
    status: "idle", // idle || fetching || success ||
    loggedIn: false
}

//constants
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const TRY_LOGIN = "TRY_LOGIN"
const LOGIN_ERROR = "LOGIN_ERROR"

//actionCreators
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
        case LOGIN_SUCCESS:
            return { loggedIn: true, ...action.payload, staus: "success", fetching: false }
        case TRY_LOGIN:
            return { fetching: true, status: "fetching" }
        case "LOGIN_ERROR":
            return { ...state, fetching: false, status: "idle", error: action.payload }
        case "LOG_OUT":
            return { loggedIn: false, status: "idle", fetching: false }
        case "SET_STATUS":
            return { ...state, status: action.payload }
        default:
            return state
    }
}

// action creators

// Epics
export function signOutEpic(action$) { }

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