import {
  getFeedPublicatios,
  getUserPublications,
  postPublication,
} from '../services/publicationServices';
import axios from 'axios';
import { successAction, errorAction } from './responseActions';
import { url } from '../services/url'

const initialWorking = {
  user: null,
  urls: [],
  imagesURLS: [],
  docsURLS: [],
  text: null,
  files: [],
  docs: [],
};

const initialState = {
  array: [],
  noData: false,
  fetching: false,
  status: null,
  workingOn: initialWorking,
  users: []
};

/* CONSTANTS */
const DELETE_PUBLICATION = "DELETE_PUBLICATION"
const DELETE_PUBLICATION_SUCCESS = "DELETE_PUBLICATION_SUCCESS"
const DELETE_PUBLICATION_ERROR = "DELETE_PUBLICATION_ERROR"

const LIKE_PUBLICATION = "LIKE_PUBLICATION"
const LIKE_PUBLICATION_SUCCESS = "LIKE_PUBLICATION_SUCCESS"
const LIKE_PUBLICATION_ERROR = "LIKE_PUBLICATION_ERROR"

const GET_USERS = "GET_USERS"
const GET_USERS_SUCCESS = "GET_USERS_SUCCESS"
const GET_USERS_ERROR = "GET_USERS_ERROR"

const PREFIX = 'PUBLICATIONS';

const FETCHING = `${PREFIX}/FETCHING`;
const FETCHING_ERROR = `${PREFIX}/FETCHING_ERROR`;
const RESET_VALUES = `${PREFIX}/RESET_VALUES`;

const WRITE_WORKING_ON = `${PREFIX}/WRITE_WORKING_ON`;
const SET_WORKING_ON = `${PREFIX}/SET_WORKING_ON`;

const POPULATE_PUBLICATIONS = `${PREFIX}/POPULATE_PUBLICATIONS`;
const CREATE_PUBLICATION = `${PREFIX}/CREATE_PUBLICATION`;


/* REDUCERS */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_PUBLICATION:
      return { ...state, fetching: true }
    case DELETE_PUBLICATION_ERROR:
      return { ...state, error: action.payload, fetching: false }
    case DELETE_PUBLICATION_SUCCESS:
      return { ...state, array: [...action.payload], fetching: false }

    case LIKE_PUBLICATION:
      return {
        ...state,
        // fetching: true 
      }
    case LIKE_PUBLICATION_ERROR:
      return { ...state, error: action.payload, fetching: false }
    case LIKE_PUBLICATION_SUCCESS:
      return { ...state, array: [...action.payload], fetching: false }

    case GET_USERS:
      return { ...state, fetching: true }
    case GET_USERS_SUCCESS:
      return { ...state, users: [...action.payload], fetching: false }
    case GET_USERS_ERROR:
      return { ...state, fetching: false, error: action.payload }

    case FETCHING:
      return { ...state, fetching: true };
    case FETCHING_ERROR:
      return { ...state, status: 'error', error: action.payload };
    case RESET_VALUES:
      return { ...state, fetching: false, status: null, workingOn: initialWorking };

    case WRITE_WORKING_ON:
      return { ...state, workingOn: action.payload };
    case SET_WORKING_ON:
      return { ...state, workingOn: action.payload };

    case POPULATE_PUBLICATIONS:
      return { ...state, status: 'success', array: action.payload, noData: action.payload.length === 0 };
    case CREATE_PUBLICATION:
      return { ...state, status: 'success', array: [action.payload, ...state.array] };
    default:
      return state;
  }
}



/* ACTIONS CREATORS */
export const fetching = () => ({ type: FETCHING });
export const fetchingError = () => ({ type: FETCHING_ERROR });
export const resetValues = () => ({ type: RESET_VALUES });

export const writeWorkingOn = (working, name, value) =>
  ({ type: WRITE_WORKING_ON, payload: { ...working, [name]: value } })
export const setWorkingOn = (working, payload) =>
  ({ type: SET_WORKING_ON, payload: { ...working, ...payload } });

const populatePublicationsAction = (pubArray) => ({ type: POPULATE_PUBLICATIONS, payload: pubArray });
const createPublicationAction = (createdPublication) => ({ type: CREATE_PUBLICATION, payload: createdPublication });


/* THUNKS */
export let deletePublicationAction = (id) => (dispatch, getState) => {
  dispatch({ type: DELETE_PUBLICATION })
  let { user: { token }, publication } = getState()
  return axios.delete(`https://amg-api.herokuapp.com/publications/${id}`, {
    headers: {
      Authorization: token,
    }
  })
    .then(res => {
      console.log("resposta", res)
      let pubs = publication.array.filter(p => p._id !== id)
      dispatch({ type: DELETE_PUBLICATION_SUCCESS, payload: [...pubs] })
    })
    .catch(e => {
      console.log("erro: ", e)
      console.log("erro: ", e.response)
      dispatch({ type: DELETE_PUBLICATION_ERROR, payload: e.response ? e.response.message : "Error en el servidor" })
    })
}


export let likedislikeAction = (id) => (dispatch, getState) => {
  const APIURL = `${url}/publications/${id}/like`;
  dispatch({ type: LIKE_PUBLICATION })
  let { user: { token }, publication } = getState()
  return axios.post(`https://amg-api.herokuapp.com/publications/${id}/like`, {}, {
    headers: {
      Authorization: token,
    }
  })
    .then(res => {
      let post = res.data
      let pubs = publication.array.map(p => {
        if (p._id == post._id) return post
        return p
      })
      dispatch({ type: LIKE_PUBLICATION_SUCCESS, payload: pubs })
    })
    .catch(e => {
      console.log("erro: ", e)
      console.log("erro: ", e.response)
      dispatch({ type: LIKE_PUBLICATION_ERROR, payload: e.response ? e.response.message : "Error en el servidor" })
    })
}

export let getUsersAction = () => (dispatch, getState) => {
  const APIURL = `${url}/users`;
  dispatch({ type: GET_USERS })
  let { user: { token }, publication } = getState()
  if (publication.users.length > 0) return dispatch({ type: GET_USERS_SUCCESS, payload: publication.users })
  return axios.get('https://amg-api.herokuapp.com/users', {
    headers: {
      Authorization: token,
    },
  })
    .then(res => {
      dispatch({ type: GET_USERS_SUCCESS, payload: res.data })
    })
    .catch(e => {
      console.log("erro: ", e)
      console.log("erro: ", e.response)
      dispatch({ type: GET_USERS_ERROR, payload: e.response ? e.response.message : "Error en el servidor" })
    })
}

export const populatePublications = (userId, userToken) => (dispatch) => {
  dispatch(fetching());

  if (!userId) return getFeedPublicatios(userToken)
    .then(publicationsArray => successAction(
      dispatch, populatePublicationsAction, publicationsArray, resetValues,
    ))
    .catch(error => errorAction(
      dispatch, fetchingError, error, resetValues, 'Publicaciones no disponibles'
    ));

  return getUserPublications(userId, userToken)
    .then(publicationsArray => successAction(
      dispatch, populatePublicationsAction, publicationsArray, resetValues,
    ))
    .catch(error => errorAction(
      dispatch, fetchingError, error, resetValues, 'Publicaciones no disponibles',
    ));
}

export const createPublication = (publicationData, token, user) => async (dispatch) => {
  dispatch(fetching());
  return postPublication(publicationData, token)
    .then(createdPublication => successAction(
      dispatch, createPublicationAction, createdPublication, resetValues,
    ))
    .catch(error => errorAction(
      dispatch, fetchingError, error, resetValues, 'Ocurrio un error al publicar',
    ));
};

