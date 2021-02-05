import axios from "axios";
import store from "../store";
class BaseApi {
  apiClient = null;
  getAxiosClient = () => {};
  constructor(axiosInput) {
    this.apiClient = axiosInput || axios;

    const { accessToken } = store.getState().authContext || {};
    if (accessToken) this.apiClient.defaults.headers.common["Authorization"] = accessToken;
  }
}
export default BaseApi;
