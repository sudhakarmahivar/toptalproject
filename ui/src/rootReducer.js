import actionTypes from "./actionTypes";

const initialState = {
  authContext: {
    userId: null,
    userName: null,
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoidSIsImlhdCI6MTYxMjUzODc5MSwiZXhwIjoxNjEyNjI1MTkxfQ.KtVKBev8vp66krAxMyZrgm_vMqxDkGiJ66wTYZ8rflk",
    role: null,
    expiresIn: 0,
  },
  userList: {
    data: [],
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
  if (action.type === actionTypes.userList.refreshed) {
    return {
      ...state,
      // and update the copy with the new value
      userList: { data: action.data },
    };
  }
  return state;
}
export default rootReducer;
