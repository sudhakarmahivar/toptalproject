import BaseApi from "./baseApi";
class UserApi extends BaseApi {
  getUsers = async () => {
    return this.apiClient.get("/user");
  };
  saveUser = async (user) => {
    return this.apiClient.put("/user", user);
  };
  createUser = async (user) => {
    return this.apiClient.post("/auth/register", user);
  };
  deleteUser = async (userId) => {
    return this.apiClient.delete("/user/" + userId);
  };
}
export default UserApi;
