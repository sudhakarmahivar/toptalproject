import actionTypes from "../actionTypes";

const initialState = {
  message: null,
  errorCode: null,
};

function errorReducer(state = initialState, action = {}) {
  // otherwise return the existing state unchanged
  if (action.type === actionTypes.error.clearError) {
    return {
      ...state,
      message: null,
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
export default errorReducer;
