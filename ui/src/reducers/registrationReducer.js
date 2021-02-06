import actionTypes from "../actionTypes";

const initialState = {
  redirectTo: null,
};

function registrationReducer(state = initialState, action = {}) {
  // otherwise return the existing state unchanged
  if (action.type === actionTypes.registration.redirectOnSuccess) {
    return {
      ...state,
      redirectTo: action.data,
    };
  }
  if (action.type === actionTypes.registration.clearRedirections) {
    return {
      ...state,
      redirectTo: null,
    };
  }
  return state;
}
export default registrationReducer;
