import {
  getFeedPublicatios,
  getUserPublications,
} from '../services/publicationServices';

import { successAction, errorAction } from './responseActions';

const initialState = {
  array: [],
  noData: false,
  fetching: false,
  status: null,
};

/* CONSTANTS */
const PREFIX = 'PUBLICATIONS';

const FETCHING = `${PREFIX}/FETCHING`;
const FETCHING_ERROR = `${PREFIX}/FETCHING_ERROR`;
const RESET_VALUES = `${PREFIX}/RESET_VALUES`;

const POPULATE_PUBLICATIONS = `${PREFIX}/POPULATE_PUBLICATIONS`;


/* ACTIONS CREATORS */
export const fetching = () => ({ type: FETCHING });
export const fetchingError = () => ({ type: FETCHING_ERROR });
export const resetValues = () => ({ type: RESET_VALUES });

const populatePublicationsAction = (pubArray) => ({ type: POPULATE_PUBLICATIONS, payload: pubArray });


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


/* REDUCERS */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCHING:
      return { ...state, fetching: true };
    case FETCHING_ERROR:
      return { ...state, status: 'error', error: action.payload };
    case RESET_VALUES:
      return { ...state, fetching: false, status: null };

    case POPULATE_PUBLICATIONS:
      return { ...state, status: 'success', array: action.payload, noData: action.payload.length === 0 };
    default:
      return state;
  }
}
