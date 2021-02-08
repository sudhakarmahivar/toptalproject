import actionTypes from "../actionTypes";

const initialState = {
  //when edit user session is on
  open: false, //used by dialog view to open
  user: null, //user being edited
  successMessage: null,
  errorMessage: null,
};

function editUserReducer(state = initialState, action = {}) {
  // User has begin editing
  if (action.type === actionTypes.editUser.begin) {
    return {
      ...state,
      user: action.data, //indicates for which user edit is happening
      open: true, //dictates edit user screen/dialog to open
    };
  }
  // User has completed editing
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
