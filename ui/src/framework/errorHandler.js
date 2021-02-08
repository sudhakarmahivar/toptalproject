import actionTypes from "../actionTypes";
import messages from "../messages";
import store from "../store";
/**
 * On Api Errors, dispatches setError action to mutate redux state
 * On generic exception ( other than server response error) uses SYSERR code
 * @param {object} err
 */
export default function errorHandler(err) {
  if (!err) return;
  let message, errorCode;
  if (err.errorCode) {
    //custom error
    message = err.message;
    errorCode = err.errorCode;
  } else {
    message = messages.systemExceptionOccurred;
    errorCode = "SYSERR";
  }

  store.dispatch({
    type: actionTypes.serviceStatus.setError,
    error: message,
    errorCode,
  });
}
