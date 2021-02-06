import BaseApi from "./baseApi";
class AuthApi extends BaseApi {
  authenticate = async (userName, password) => {
    return this.apiClient.post("/auth/login", {
      userName,
      password,
    });
  };
}
export default AuthApi;
