import axios from "axios";
class AuthApi {
  apiClient = null;
  constructor(axiosInput) {
    this.apiClient = axiosInput || axios;
  }
  authenticate = async (userName, password) => {
    return this.apiClient
      .post("/auth/login", {
        userName,
        password,
      })
      .then((res) => res.data);
  };
  registerUser = async (userName, password) => {
    return this.apiClient
      .post("/auth/register", {
        userName,
        password,
      })
      .then((res) => res.data);
  };
}
export default AuthApi;
