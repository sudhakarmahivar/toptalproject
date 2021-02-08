import BaseApi from "./baseApi";
import config from "../config";
class AuthApi extends BaseApi {
  authenticate = async (userName, password) => {
    return this.apiClient.post(config.apiEndPoints.login, {
      userName,
      password,
    });
  };
  logout = async () => {
    return this.apiClient.post(config.apiEndPoints.logout);
  };
}
export default AuthApi;
