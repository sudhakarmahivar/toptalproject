import actionTypes from "../actionTypes";
/**
 * Reducer to manage service status, error message,code
 */
const initialState = {
  message: null, //hold recent success/error message issued by controller
  errorCode: null, //applicable in case of error
};

function serviceStatusReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.serviceStatus.clearError) {
    return {
      ...state,
      message: state.errorCode ? null : state.message, //clear only if its error
      errorCode: null,
    };
  }
  if (action.type === actionTypes.serviceStatus.clearSuccess) {
    return {
      ...state,
      message: !state.errorCode ? null : state.message, //clear only if its error
    };
  }
  if (action.type === actionTypes.serviceStatus.clearAll) {
    return {
      ...state,
      message: null,
      errorCode: null,
    };
  }
  if (action.type === actionTypes.serviceStatus.setSuccess) {
    return {
      ...state,
      message: action.data,
      errorCode: null,
    };
  }
  if (action.error) {
    return {
      ...state,
      message: action.error,
      errorCode: action.errorCode,
    };
  }
  return state;
}
export default serviceStatusReducer;
