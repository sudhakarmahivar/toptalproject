import UserApi from "../api/userApi";
import actionTypes from "../actionTypes";
import errorHandler from "../framework/errorHandler";
import { push } from "connected-react-router";
import messages from "../messages";

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
 * Save user with new values and calls back
 * @param {object} user User object to save
 * @param {object} onSuccess
 */
function saveUser(user, onSuccess) {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      dispatch({ type: actionTypes.serviceStatus.clearAll });
      let data = await userApi.saveUser(user);

      dispatch({
        type: actionTypes.userList.updateUser,
        data,
      });
      dispatch({
        type: actionTypes.editUser.end,
      });
      dispatch({
        type: actionTypes.serviceStatus.setSuccess,
        data: messages.userSavedSuccessfully,
      });
      onSuccess && onSuccess(data);
    } catch (ex) {
      errorHandler(ex);
    }
  };
}

/**
 * Delete user successfully
 * @param {number} userId
 */
function deleteUser(userId) {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      await userApi.deleteUser(userId);
      dispatch({
        type: actionTypes.userList.deleteUser,
        data: userId,
      });
      dispatch({
        type: actionTypes.serviceStatus.setSuccess,
        data: messages.userDeletedSuccessfully,
      });
    } catch (err) {
      errorHandler(err);
    }
  };
}
/**
 * Registers new user. On success either calls success call back or redirect to home
 * @param {object} user New User object
 * @param {*} onSuccess Success callback
 */
function registerUser(user, onSuccess) {
  return async function (dispatch) {
    const userApi = new UserApi();
    try {
      let data = await userApi.createUser(user);
      dispatch({
        type: actionTypes.registration.registrationSucceeded,
        data,
      });
      dispatch({
        type: actionTypes.serviceStatus.setSuccess,
        data: messages.userRegisteredSuccessfully,
      });
      if (onSuccess) onSuccess(data);
      else dispatch(push("/"));
    } catch (err) {
      errorHandler(err);
    }
  };
}

export { getUsers, registerUser, deleteUser, saveUser };
