import AuthApi from "../api/authApi";
import actionTypes from "../actionTypes";
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
      let data = await authApi.authenticate(userName, password);
      dispatch({
        type: actionTypes.auth.authSucceeded,
        data,
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

export { authenticate };
