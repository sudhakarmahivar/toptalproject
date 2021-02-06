import axios from "axios";
import store from "../store";
import ApiError from "./apiError";
class BaseApi {
  apiClient = null;
  constructor(axiosInput) {
    this.apiClient = axiosInput || axios.create();

    const { accessToken } = store.getState().authContext || {};
    if (accessToken) this.apiClient.defaults.headers.common["Authorization"] = accessToken;
    this.apiClient.interceptors.response.use(
      (response) => response.data,
      (err) => {
        if (err.response) {
          //Service has been hit and we got non 2xx response
          const { errorCode, message } = err.response.data;
          throw new ApiError(message, errorCode);
        } else {
          throw new ApiError("Service Error", "SYSERR");
        }
      }
    );
  }
}
export default BaseApi;
