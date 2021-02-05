import axios from "axios";
import BaseApi from "./baseApi";
class UserApi extends BaseApi {
  getUsers = async () => {
    return this.apiClient.get("/user").then((res) => res.data);
  };
}
export default UserApi;
