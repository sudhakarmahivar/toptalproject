import UserApi from "../api/userApi";
import actionTypes from "../actionTypes";
import errorHandler from "../framework/errorHandler";
/**
 * Get Users list ( non deleted)
 */
function getUsers() {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      let data = await userApi.getUsers();
      dispatch({
        type: actionTypes.userList.refreshed,
        data,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
/**
 * Save user with new values
 * @param {*} user
 */
function saveUser(user) {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      let data = await userApi.saveUser(user);
      dispatch({
        type: actionTypes.userList.updateUser,
        data,
      });
      dispatch({
        type: actionTypes.editUser.end,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
// Launch dialog box for user edit
function openEditUserDialog(userId) {
  return {
    type: actionTypes.editUser.begin,
    data: userId,
  };
}

// Close dialog box once edit completed/cancelled
function closeEditUserDialog() {
  return {
    type: actionTypes.editUser.end,
  };
}

export { getUsers, openEditUserDialog, closeEditUserDialog, saveUser };
