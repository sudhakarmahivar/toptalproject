import actionTypes from "../actionTypes";
import errorHandler from "../framework/errorHandler";
import TimeSheetApi from "../api/timeSheetApi";
import { getUserContext } from "../framework/userContext";
function getTimeSheets(fromDate, toDate, userId) {
  return async function (dispatch) {
    //default to logged in user
    userId = userId || getUserContext().userId;
    const timeSheetApi = new TimeSheetApi();
    try {
      let timeSheets = await timeSheetApi.getTimeSheets(userId, fromDate, toDate);
      dispatch({
        type: actionTypes.timeSheetList.refreshed,
        data: { timeSheets, userId, fromDate, toDate },
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
function showDayTimeSheet(date) {
  return {
    type: actionTypes.timeSheetList.showDayTimeSheet,
    data: date,
  };
}

export { getTimeSheets, showDayTimeSheet };
