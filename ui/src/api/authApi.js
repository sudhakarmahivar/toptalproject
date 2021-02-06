import BaseApi from "./baseApi";
class AuthApi extends BaseApi {
  authenticate = async (userName, password) => {
    return this.apiClient.post("/auth/login", {
      userName,
      password,
    });
  };
  registerUser = async (user) => {
    return this.apiClient.post("/auth/register", user);
  };
}
export default AuthApi;
