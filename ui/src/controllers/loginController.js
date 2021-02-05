import AuthApi from "../api/authApi";
import actionTypes from "../actionTypes";
function authenticate(userName, password) {
  return async function (dispatch, getState) {
    const authApi = new AuthApi();
    try {
      let result = await authApi.authenticate(userName, password);
      dispatch({
        type: actionTypes.auth.authSucceeded,
        data: result,
      });
    } catch (ex) {}
  };
}
function registerUser(userName, password) {
  return async function (dispatch, getState) {
    const authApi = new AuthApi();
    try {
      let result = await authApi.registerUser(userName, password);
      dispatch({
        type: actionTypes.auth.registrationSucceeded,
        data: result,
      });
      console.log(result);
    } catch (ex) {}
  };
}

export { authenticate, registerUser };
