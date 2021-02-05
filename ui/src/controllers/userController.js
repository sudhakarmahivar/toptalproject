import UserApi from "../api/userApi";
import actionTypes from "../actionTypes";
function getUsers() {
  return async function (dispatch, getState) {
    const userApi = new UserApi();
    try {
      let result = await userApi.getUsers();
      dispatch({
        type: actionTypes.userList.refreshed,
        data: result,
      });
    } catch (ex) {}
  };
}

export { getUsers };
