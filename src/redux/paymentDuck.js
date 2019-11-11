import { combineReducers } from 'redux';
import { postPayment } from '../services/paymentsService';
import { successAction, errorAction } from './responseActions';


/* NO WORKING ON */
/* CONSTANTS */
const PREFIX = 'PAYMENT';

const FETCHING = `${PREFIX}/FETCHING`;
const FETCHING_ERROR = `${PREFIX}/FETCHING_ERROR`;
const RESET_VALUES = `${PREFIX}/RESET_VALUES`;

const MAKE_PAYMENT = `${PREFIX}/MAKE_PAYMENT`;


/* ACTIONS CREATORS */
// commons
export const fetching = () => ({ type: FETCHING });
export const fetchingError = () => ({ type: FETCHING_ERROR });
export const resetValues = () => ({ type: RESET_VALUES });

// FOR PAYMENT
const makePaymentAction = (createdPayment) => ({ type: MAKE_PAYMENT, payload: createdPayment });


/* THUNKS */
export const makePayment = (paymentPayload, paymentType) => (dispatch) => {
  dispatch(fetching());
  return postPayment(paymentPayload, paymentType)
    .then(createdPayment => {
      successAction(dispatch, makePaymentAction, createdPayment, resetValues)
      return createdPayment;
    })
    .catch(error => {
      errorAction(dispatch, fetchingError, error, resetValues);
      return error;
    });
}

const initialPaymentState = {
  array: [],
  noData: false,
  fetching: false,
  status: null,
}

/* REDUCER */
function paymentReducer(state = initialPaymentState, action) {
  switch (action.type) {
    /* COMMON */
    case FETCHING:
      return { ...state, fetching: true };
    case FETCHING_ERROR:
      return { ...state, status: 'error', error: action.payload };
    case RESET_VALUES:
      return { ...state, fetching: false, status: null };
    /* PAYMENT */
    case MAKE_PAYMENT:
      return { ...state, status: 'success', array: [action.payload, ...state.array] };
    default:
      return state;
  }
}


/* WORKING ON */
const WORKING_ON = `${PREFIX}/WORKING_ON`;
const SET_WORKING = `${PREFIX}/SET_WORKING`;

/* ACTIONS  CREATORS */
export const workingOn = (working, name, value) => {
  const keys = name.split('.');
  const payload = {};
  if (keys.length === 2) payload = { ...working, [keys[0]]: { ...[keys[0]], [keys[1]]: value } };
  payload = { ...working, [keys[0]]: value };
  return { type: WORKING_ON, payload };
}

export const setWorkingOn = working => ({ type: SET_WORKING, payload: working });

/* REDUCER FOR WORKING ON */
const workingOnState = {
  conektaToken: null,
  phone: null,
  price: 100,
  concept: null,
};

function workingOnRefucer(state = workingOnState, action) {
  switch (action.type) {
    case WORKING_ON:
      return { ...state, ...action.payload };
    case SET_WORKING:
      return { ...action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  payment: paymentReducer,
  workingOn: workingOnRefucer,
});
