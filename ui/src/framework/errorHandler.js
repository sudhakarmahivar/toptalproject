import actionTypes from "../actionTypes";
import store from "../store";
export default function errorHandler(err) {
  if (!err) return;
  let message, errorCode;
  if (err.errorCode) {
    //custom error
    message = err.message;
    errorCode = err.errorCode;
  } else {
    message = "System exception occurred";
    errorCode = "SYSERR";
  }

  store.dispatch({
    type: actionTypes.error.setError,
    error: message,
    errorCode,
  });
}
