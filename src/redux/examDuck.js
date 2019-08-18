import axios from 'axios'

let baseURL = "https://amg-api.herokuapp.com"

let initialState = {
    array: [],
    questions: [],
    answers: {},
    currentQuestion: {},
    currentIndex: 0,
    totalQuestions: 10,
    status: "idle", // "allowed" || "doing" || fetching,
    fetching: false,
    finished: false,
    total: null
}
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case RESET_EXAM:
            return { ...initialState }

        case SAVE_ANSWER:
            return { ...state, status: "doing", answers: { ...state.answers, ...action.payload } }
        case NEXT_QUESTION:
            return { ...state, status: "doing", currentIndex: action.payload, currentQuestion: { ...state.questions[action.payload] } }
        case FINISH_EXAM:
            return { ...state, finished: true, currentIndex: 0, status: "idle", fetching: true }
        case UPLOAD_ANSWERS_ERROR:
            return { ...state, error: action.payload }
        case UPLOAD_ANSWERS_SUCCESS:
            return { ...state, status: "success", ...action.payload }

        case GET_EXAMS_FROM_EVENT:
            return { ...state, status: "fetching", fetching: true }
        case GET_EXAMS_FROM_EVENT_SUCCESS:
            return { ...state, status: "idle", fetching: false, array: [...action.payload] }
        case GET_EXAMS_FROM_EVENT_ERROR:
            return { ...state, status: "idle", fetching: false, erro: action.payload }

        case GET_EXAM:
            return { ...state, status: "fetching", fetching: true, finished: false }
        case GET_EXAM_SUCCESS:
            return { ...state, fetching: false, error: null, ...action.payload, status: "allowed", currentQuestion: action.payload.questions[0] }
        case GET_EXAM_ERROR:
            return { ...state, fetching: false, error: action.payload }
        default:
            return state
    }
}

// mostrar preguntas en secuencia

// responder preguntas e ir almacenandolas 
// establecer limite de tiempo con fecha

// al terminar blockear examen

let GET_EXAMS_FROM_EVENT = "GET_EXAMS_FROM_EVENT"
let GET_EXAMS_FROM_EVENT_SUCCESS = "GET_EXAMS_FROM_EVENT_SUCCESS"
let GET_EXAMS_FROM_EVENT_ERROR = "GET_EXAMS_FROM_EVENT_ERROR"

let GET_EXAM = "GET_EXAM"
let GET_EXAM_SUCCESS = "GET_EXAM_SUCCESS"
let GET_EXAM_ERROR = "GET_EXAM_ERROR"

let SAVE_ANSWER = "SAVE_ANSWER"
let NEXT_QUESTION = "NEXT_QUESTION"
let FINISH_EXAM = "FINISH_EXAM"
let UPLOAD_ANSWERS_ERROR = "UPLOAD_ANSWERS_ERROR"
let UPLOAD_ANSWERS_SUCCESS = "UPLOAD_ANSWERS_SUCCESS"

let RESET_EXAM = "RESET_EXAM"

let saveAnswer = answer => ({ type: SAVE_ANSWER, payload: answer })
let nextQuestion = currentIndex => ({ type: NEXT_QUESTION, payload: currentIndex })
let finishExam = () => ({ type: FINISH_EXAM })

let getExamsFromEvent = () => ({ type: GET_EXAMS_FROM_EVENT })
let getExamsFromEventSuccess = (events) => ({ payload: events, type: GET_EXAMS_FROM_EVENT_SUCCESS })
let getExamsFromEventError = (err) => ({ payload: err, type: GET_EXAMS_FROM_EVENT_ERROR })


let getExam = () => ({ type: GET_EXAM })
let getExamSuccess = exam => ({ type: GET_EXAM_SUCCESS, payload: exam })
let getExamError = err => ({ type: GET_EXAM_ERROR, payload: err })


// simple action in exam responses
export function resetExamAction() {
    return function (dispatch) {
        dispatch({ type: RESET_EXAM })
    }
}

export let saveAnswerAction = (answer) => (dispatch, getState) => {
    let { exam: { currentIndex, totalQuestions, _id }, user: { token } } = getState()
    dispatch(saveAnswer(answer))
    //check if next or finish
    if (currentIndex === (totalQuestions - 1)) {
        let { exam: { answers } } = getState()
        dispatch(finishExam())
        return axios.post(`${baseURL}/exams/${_id}/answer`, { answers }, { headers: { Authorization: token } })
            .then(res => {
                dispatch({ type: UPLOAD_ANSWERS_SUCCESS, payload: res.data })
            })
            .catch(err => {
                console.log(err)
                dispatch({ type: UPLOAD_ANSWERS_ERROR, payload: err.response.data.message })
            })
    }
    else {
        dispatch(nextQuestion(++currentIndex))
        return false
    }

}


export let getExamAction = id => (dispatch, getState) => {
    dispatch(getExam())
    let { user: { token } } = getState()
    return axios.get(`${baseURL}/exams/${id}`, { headers: { Authorization: token } })
        .then(res => {
            let totalQuestions = res.data.questions ? res.data.questions.length : 10
            //  let questions = res.data.questions ? res.data.questions : []
            dispatch(getExamSuccess({ ...res.data, totalQuestions }))
            return res
        })
        .catch(err => {
            dispatch(getExamError(err.response.data.message))
            return err
        })
}

export let getExamsFromEventAction = eventId => (dispatch, getState) => {
    dispatch(getExamsFromEvent())
    let { user: { token } } = getState()
    return axios.get(`${baseURL}/exams?event=${eventId}`, { headers: { Authorization: token } })
        .then(res => {

            dispatch(getExamsFromEventSuccess(res.data))
        })
        .catch(err => {
            console.log(err)
            dispatch(getExamsFromEventError(err.response.data.message))
        })
}


