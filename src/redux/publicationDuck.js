import {
  getFeedPublicatios,
  getUserPublications,
  postPublication,
} from '../services/publicationServices';
import axios from 'axios';
import { successAction, errorAction } from './responseActions';
import firebase from '../services/firebase';

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
};

/* CONSTANTS */
const PREFIX = 'PUBLICATIONS';

const FETCHING = `${PREFIX}/FETCHING`;
const FETCHING_ERROR = `${PREFIX}/FETCHING_ERROR`;
const RESET_VALUES = `${PREFIX}/RESET_VALUES`;

const WRITE_WORKING_ON = `${PREFIX}/WRITE_WORKING_ON`;
const SET_WORKING_ON = `${PREFIX}/SET_WORKING_ON`;

const POPULATE_PUBLICATIONS = `${PREFIX}/POPULATE_PUBLICATIONS`;
const CREATE_PUBLICATION = `${PREFIX}/CREATE_PUBLICATION`;


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


/* REDUCERS */
export default function reducer(state = initialState, action) {
  switch (action.type) {
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
