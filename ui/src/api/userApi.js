import BaseApi from "./baseApi";
import config from "../config";

class UserApi extends BaseApi {
  getUsers = async () => {
    return this.apiClient.get(config.apiEndPoints.user);
  };
  saveUser = async (user) => {
    return this.apiClient.put(config.apiEndPoints.user, user);
  };
  createUser = async (user) => {
    return this.apiClient.post(`${config.apiEndPoints.register}`, user);
  };
  deleteUser = async (userId) => {
    return this.apiClient.delete(`${config.apiEndPoints.user}/${userId}`);
  };
}
export default UserApi;
