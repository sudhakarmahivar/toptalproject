import actionTypes from "../actionTypes";
import errorHandler from "../framework/errorHandler";
import TimeSheetApi from "../api/timeSheetApi";
import { getUserContext } from "../framework/userContext";
import messages from "../messages";
/**
 * Retrieves timesheets for period of user sent. If user not sent uses logged in user
 * @param {string} fromDate date in YYYY-MM-DD format
 * @param {string} toDate   date in YYYY-MM-DD format
 * @param {number} userId  If not sent, uses loggedin user id
 */
function getTimeSheets(fromDate, toDate, userId) {
  return async function (dispatch) {
    //default to logged in user
    dispatch({
      type: actionTypes.serviceStatus.clearAll,
    });
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
/**
 * Saves timesheets to server through Api Call
 * @param {object[]} timeSheets
 */
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
      dispatch({
        type: actionTypes.serviceStatus.setSuccess,
        data: messages.timeSheetSavedSuccessfully,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
/**
 * Updates timesheets in server through Api call
 * @param {object[]} timeSheets
 */
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
      dispatch({
        type: actionTypes.serviceStatus.setSuccess,
        data: messages.timeSheetSavedSuccessfully,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
/**
 * Deletes Timesheets identified by .timeSheetId
 * @param {object[]} timeSheets
 */
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
      dispatch({
        type: actionTypes.serviceStatus.setSuccess,
        data: messages.timeSheetSavedSuccessfully,
      });
    } catch (ex) {
      errorHandler(ex);
    }
  };
}
/**
 * Changes date for Timesheet Day view
 * @param {string} date  date in YYYY-MM-DD format
 * @param {number} userId
 */
function showDayTimeSheet(date, userId) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.serviceStatus.clearAll,
    });

    dispatch({
      type: actionTypes.timeSheetList.showDayTimeSheet,
      data: { date, userId },
    });
  };
}

export { getTimeSheets, showDayTimeSheet, addTimeSheets, updateTimeSheets, deleteTimeSheets };
