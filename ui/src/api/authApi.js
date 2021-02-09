import BaseApi from "./baseApi";
import config from "../config";
class AuthApi extends BaseApi {
  async authenticate(userName, password) {
    return this.apiClient.post(config.apiEndPoints.login, {
      userName,
      password,
    });
  }
  async logout() {
    return this.apiClient.post(config.apiEndPoints.logout);
  }
}
export default AuthApi;
