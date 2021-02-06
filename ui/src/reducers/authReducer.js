import actionTypes from "../actionTypes";

const initialState = {
  userId: null,
  userName: null,
  accessToken: null,
  //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoidSIsImlhdCI6MTYxMjUzODc5MSwiZXhwIjoxNjEyNjI1MTkxfQ.KtVKBev8vp66krAxMyZrgm_vMqxDkGiJ66wTYZ8rflk",
  role: null,
  expiresIn: 0,
};

function authReducer(state = initialState, action = {}) {
  // otherwise return the existing state unchanged
  if (action.type === actionTypes.auth.authSucceeded) {
    return {
      ...state,
      ...action.data,
    };
  }
  return state;
}
export default authReducer;
