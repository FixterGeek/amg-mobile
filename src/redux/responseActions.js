export function successAction(dispatch, successAction, actionPayload, resetAction) {
  dispatch(successAction(actionPayload));
  dispatch(resetAction());
  return actionPayload;
}

export function errorAction(dispatch, errorAction, error, resetAction, errorMessage = 'Error desconosido') {
  const { response = {} } = error;
  console.log(error.response, error);
  const { data = { message: errorMessage } } = response;
  const message = data.error || data.message;
  dispatch(errorAction());
  dispatch(resetAction());
  return message;
}