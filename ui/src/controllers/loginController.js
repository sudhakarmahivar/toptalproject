import AuthApi from "../api/authApi";
import actionTypes from "../actionTypes";
import errorHandler from "../framework/errorHandler";
/**
 * Authenticates user and sets user to redux on success
 * @param {string} userName
 * @param {string} password password in plain text
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

export { authenticate };
