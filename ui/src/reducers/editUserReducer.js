import actionTypes from "../actionTypes";

const initialState = {
  //when edit user session is on
  open: false, //only for dialog view
  userId: null,
  user: {
    //user object being edited
  },
  successMessage: null,
  errorMessage: null,
};

function editUserReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.editUser.begin) {
    return {
      ...state,
      // and update the copy with the new value
      userId: action.data,
      open: true,
    };
  }
  if (action.type === actionTypes.auth.registrationSucceeded || action.type === actionTypes.editUser.end) {
    return {
      ...state,
      userId: null,
      open: false,
    };
  }
  return state;
}
export default editUserReducer;
