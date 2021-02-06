import BaseApi from "./baseApi";
class UserApi extends BaseApi {
  getUsers = async () => {
    return this.apiClient.get("/user");
  };
  saveUser = async (user) => {
    return this.apiClient.put("/user", user);
  };
}
export default UserApi;
