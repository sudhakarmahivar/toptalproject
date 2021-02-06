import actionTypes from "../actionTypes";

const initialState = {
  data: [],
};

function userListReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.userList.refreshed) {
    return {
      ...state,
      // and update the copy with the new value
      data: action.data,
    };
  }
  if (action.type === actionTypes.auth.registrationSucceeded) {
    //refresh userList
    const user = action.data;
    const userList = [...state.data];
    const existingUserIndex = userList.findIndex((u) => u.userId === user.userId);
    if (existingUserIndex < 0) {
      //new user. push to userList
      userList.push(user);
    } else {
      userList[existingUserIndex] = user;
    }
    return {
      ...state,
      data: userList,
    };
  }
  return state;
}
export default userListReducer;
