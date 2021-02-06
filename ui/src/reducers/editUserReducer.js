import actionTypes from "../actionTypes";

const initialState = {
  //when edit user session is on
  open: false, //only for dialog view
  user: null,
  successMessage: null,
  errorMessage: null,
};

function editUserReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.editUser.begin) {
    return {
      ...state,
      // and update the copy with the new value
      user: action.data,
      open: true,
    };
  }
  if (action.type === actionTypes.auth.registrationSucceeded || action.type === actionTypes.editUser.end) {
    return {
      ...state,
      user: null,
      open: false,
    };
  }
  return state;
}
export default editUserReducer;
