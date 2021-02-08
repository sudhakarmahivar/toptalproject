import BaseApi from "./baseApi";
import config from "../config";
/**
 * ApiClient for timesheet end points
 */
class TimeSheetApi extends BaseApi {
  getTimeSheets = async (userId, fromDate, toDate) => {
    return this.apiClient.get(config.apiEndPoints.timeSheet, { params: { userId, fromDate, toDate } });
  };
  createTimeSheet = async (timeSheet) => {
    return this.apiClient.post(config.apiEndPoints.timeSheet, timeSheet);
  };
  updateTimeSheet = async (timeSheet) => {
    return this.apiClient.put(config.apiEndPoints.timeSheet, timeSheet);
  };
  deleteTimeSheet = async (timeSheetId) => {
    return this.apiClient.delete(config.apiEndPoints.timeSheet + "/" + timeSheetId);
  };
}
export default TimeSheetApi;
