import axios from "axios";
import { getAccessToken } from "../framework/userContext";
import ApiError from "./apiError";
/**
 * Base class for API Client.
 * Attaches token on headers automatically.
 * On Service errors, wraps into custom error object for easier processing in higher layers
 */
class BaseApi {
  apiClient = null;
  constructor(axiosInput) {
    this.apiClient = axiosInput || axios.create();

    //attach accessToken if available
    const accessToken = getAccessToken();
    if (accessToken) this.apiClient.defaults.headers.common["Authorization"] = accessToken;

    this.apiClient.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (err) => {
        console.error(err);
        if (err.response) {
          //Service has been hit and we got non 2xx response. Raise an custom error
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
