import AuthApi from "../api/authApi";
import actionTypes from "../actionTypes";
import { push } from "connected-react-router";
import errorHandler from "../framework/errorHandler";
/**
 * Do username , password authentications
 * @param {string} userName
 * @param {string} password
 */
function authenticate(userName, password) {
  return async function (dispatch) {
    const authApi = new AuthApi();
    try {
      let result = await authApi.authenticate(userName, password);
      dispatch({
        type: actionTypes.auth.authSucceeded,
        data: result,
      });
    } catch (err) {
      errorHandler(err);
    }
  };
}
/**
 * New user registration. Once successfully added takes user to login page
 * @param {object} user
 */
function registerUser(user) {
  return async function (dispatch, getState) {
    const authApi = new AuthApi();
    try {
      let result = await authApi.registerUser(user);
      dispatch({
        type: actionTypes.auth.registrationSucceeded,
        data: result,
      });
      dispatch({
        type: actionTypes.userList.addUser,
        data: result,
      });
      dispatch(push("/"));
    } catch (err) {
      errorHandler(err);
    }
  };
}

export { authenticate, registerUser };
