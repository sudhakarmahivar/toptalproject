import UserApi from "../api/userApi";
import actionTypes from "../actionTypes";
import errorHandler from "../framework/errorHandler";
import { push } from "connected-react-router";

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
function saveUser(user, onSuccess) {
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
      onSuccess && onSuccess(data);
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
function deleteUser(userId) {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      await userApi.deleteUser(userId);
      dispatch({
        type: actionTypes.userList.deleteUser,
        data: userId,
      });
    } catch (err) {
      errorHandler(err);
    }
  };
}

function registerUser(user, onSuccess) {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      let data = await userApi.createUser(user);
      dispatch({
        type: actionTypes.registration.registrationSucceeded,
        data,
      });
      if (onSuccess) onSuccess(data);
      else dispatch(push("/"));
    } catch (err) {
      errorHandler(err);
    }
  };
}

export { getUsers, registerUser, deleteUser, saveUser };
