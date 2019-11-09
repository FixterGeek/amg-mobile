import axios from 'axios';

import { successAction, errorAction } from './responseActions';

const baseURL = "https://amg-api.herokuapp.com"

const initialState = {
  array: [],
  noData: false,
  fetching: false,
  status: null,
};

/* CONSTANTS */
const PREFIX = 'COURSES';

const FETCHING = `${PREFIX}/FETCHING`;
const FETCHING_ERROR = `${PREFIX}/FETCHING_ERROR`;
const RESET_VALUES = `${PREFIX}/RESET_VALUES`;

const POPULATE_EVENT_COURSES = `${PREFIX}/POPULATE_EVENT_COURSES`;


/* ACTIONS CREATORS */
export const fetching = () => ({ type: FETCHING });
export const fetchingError = error => ({ type: FETCHING_ERROR, payload: error });
export const resetValues = () => ({ type: RESET_VALUES });

const populateEventCoursesAction = coursesArray => ({ type: POPULATE_EVENT_COURSES, payload: coursesArray });

/* THUNKS */
export const populateEventCourses = (eventId, token) => (dispatch) => {
  dispatch(fetching());
  return axios.get(`${baseURL}/courses?query={"event":"${eventId}"}`, {
    headers: { Authorization: token },
  }).then(({ data }) => successAction(
    dispatch, populateEventCoursesAction, data, resetValues
  )).catch(error => errorAction(
    dispatch, fetchingError, error, resetValues,
  ));
};


/* REDUCER */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCHING:
      return { ...state, fetching: true };
    case FETCHING_ERROR:
      return { ...state, status: 'error', error: action.payload };
    case RESET_VALUES:
      return { ...state, fetching: false, status: null };

    case POPULATE_EVENT_COURSES:
      return { ...state, status: 'success', array: action.payload, noData: action.payload.length === 0 };

    default:
      return state;
  }
}
