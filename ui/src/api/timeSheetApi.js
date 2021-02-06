import BaseApi from "./baseApi";
class TimeSheetApi extends BaseApi {
  getTimeSheets = async (userId, fromDate, toDate) => {
    return this.apiClient.get("/timesheet", { params: { userId, fromDate, toDate } });
  };
}
export default TimeSheetApi;
