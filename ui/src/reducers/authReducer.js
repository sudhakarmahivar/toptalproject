import actionTypes from "../actionTypes";

/**
 * Reduces authContext redux state
 * Holds current logged in user detail
 */
const initialState = {
  userId: null,
  userName: null,
  name: null,
  email: null,
  accessToken: null,
  //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoidSIsImlhdCI6MTYxMjUzODc5MSwiZXhwIjoxNjEyNjI1MTkxfQ.KtVKBev8vp66krAxMyZrgm_vMqxDkGiJ66wTYZ8rflk",
  role: null,
  expiresIn: 0,
  workingHoursPerDay: 0,
};

function authReducer(state = initialState, action = {}) {
  //on authentication success
  if (action.type === actionTypes.auth.authSucceeded) {
    return {
      ...state,
      ...action.data,
    };
  }
  if (action.type === actionTypes.auth.loggedOut) {
    return initialState;
  }
  if (action.type === actionTypes.userList.updateUser) {
    const user = action.data;
    if (user.userId === state.userId) {
      //current logged in user.Update details such as workingHoursPerDay, role etc
      return {
        ...state,
        ...action.data,
      };
    }
  }
  return state;
}
export default authReducer;
