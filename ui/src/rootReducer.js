import actionTypes from "./actionTypes";

const initialState = {
  authContext: {
    userId: null,
    userName: null,
    accessToken: null,
    role: null,
    expiresIn: 0,
  },
};

function rootReducer(state = initialState, action = {}) {
  // otherwise return the existing state unchanged
  if (action.type === actionTypes.auth.authSucceeded) {
    return {
      ...state,
      // and update the copy with the new value
      authContext: { ...state.authContext, ...action.data },
    };
  }
  return state;
}
export default rootReducer;
