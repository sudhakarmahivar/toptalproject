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
function addTimeSheets(timeSheets) {
  return async function (dispatch) {
    //default to logged in user
    const timeSheetApi = new TimeSheetApi();
    try {
      const apiCalls = timeSheets.map((ts) => timeSheetApi.createTimeSheet(ts));
      const result = await Promise.all(apiCalls);

      dispatch({
        type: actionTypes.timeSheetList.addTimeSheets,
        data: result,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
function updateTimeSheets(timeSheets) {
  return async function (dispatch) {
    //default to logged in user
    const timeSheetApi = new TimeSheetApi();
    try {
      const apiCalls = timeSheets.map((ts) => timeSheetApi.updateTimeSheet(ts));
      const result = await Promise.all(apiCalls);

      dispatch({
        type: actionTypes.timeSheetList.updateTimeSheets,
        data: result,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
function deleteTimeSheets(timeSheets) {
  return async function (dispatch) {
    //default to logged in user
    const timeSheetApi = new TimeSheetApi();
    try {
      const apiCalls = timeSheets.map((ts) => timeSheetApi.deleteTimeSheet(ts.timeSheetId));
      const result = await Promise.all(apiCalls);

      dispatch({
        type: actionTypes.timeSheetList.deleteTimeSheets,
        data: result,
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

export { getTimeSheets, showDayTimeSheet, addTimeSheets, updateTimeSheets, deleteTimeSheets };
