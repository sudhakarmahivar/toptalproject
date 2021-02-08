import actionTypes from "../actionTypes";

const initialState = {
  users: [], //list of users ( drop down display in timesheet list view)
};

function userListReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.userList.refreshed) {
    return {
      ...state,
      users: action.data,
    };
  }
  //When new user registered add the users to the list
  if (action.type === actionTypes.registration.registrationSucceeded) {
    const users = [...state.users];
    users.push(action.data);
    return {
      ...state,
      // and update the copy with the new value
      users,
    };
  }
  //On update refresh user
  if (action.type === actionTypes.userList.updateUser) {
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
  //remove user, when deleted
  if (action.type === actionTypes.userList.deleteUser) {
    const userId = action.data;
    let users = state.users.filter((user) => user.userId !== userId);
    return {
      ...state,
      users,
    };
  }
  return state;
}
export default userListReducer;
