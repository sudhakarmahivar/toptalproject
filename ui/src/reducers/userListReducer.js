import actionTypes from "../actionTypes";

const initialState = {
  users: [],
};

function userListReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.userList.refreshed) {
    return {
      ...state,
      // and update the copy with the new value
      users: action.data,
    };
  }
  if (action.type === actionTypes.registration.registrationSucceeded) {
    const users = [...state.users];
    users.push(action.data);
    return {
      ...state,
      // and update the copy with the new value
      users,
    };
  }
  if (action.type === actionTypes.userList.updateUser) {
    //refresh userList
    const user = action.data;
    const users = [...state.users];
    const existingUserIndex = users.findIndex((u) => u.userId === user.userId);
    if (existingUserIndex < 0) {
      return state;
    } else {
      users[existingUserIndex] = user;
    }
    return {
      ...state,
      users,
    };
  }
  return state;
}
export default userListReducer;
