import BaseApi from "./baseApi";
import config from "../config";

class UserApi extends BaseApi {
  getUsers = async () => {
    return this.apiClient.get(config.apiEndPoints.user);
  };
  saveUser = async (user) => {
    return this.apiClient.put(config.apiEndPoints.user, user);
  };
  createUser = async (user, loggedIn) => {
    //use different endpoints depending on if user logged in
    const endPoint = loggedIn ? config.apiEndPoints.user : config.apiEndPoints.register;
    return this.apiClient.post(endPoint, user);
  };
  deleteUser = async (userId) => {
    return this.apiClient.delete(`${config.apiEndPoints.user}/${userId}`);
  };
}
export default UserApi;
