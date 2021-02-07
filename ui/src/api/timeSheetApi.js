import BaseApi from "./baseApi";
class TimeSheetApi extends BaseApi {
  getTimeSheets = async (userId, fromDate, toDate) => {
    return this.apiClient.get("/timesheet", { params: { userId, fromDate, toDate } });
  };
  createTimeSheet = async (timeSheet) => {
    return this.apiClient.post("/timesheet", timeSheet);
  };
  updateTimeSheet = async (timeSheet) => {
    return this.apiClient.put("/timesheet", timeSheet);
  };
  deleteTimeSheet = async (timeSheetId) => {
    return this.apiClient.delete("/timesheet/" + timeSheetId);
  };
}
export default TimeSheetApi;
