import actionTypes from "../actionTypes";

const initialState = {
  userId: null, //User for which timeSheetList is displayed
  fromDate: null, //search -fromDate parameter
  toDate: null, //search - toDate parameter
  timeSheets: [], //result for userId,fromDate, toDate search
  date: null, //single date timesheet being displayed
};

function timeSheetListReducer(state = initialState, action = {}) {
  if (action.type === actionTypes.timeSheetList.refreshed) {
    return {
      ...state,
      ...action.data,
    };
  }
  if (action.type === actionTypes.timeSheetList.showDayTimeSheet) {
    return {
      ...state,
      ...action.data,
    };
  }
  if (action.type === actionTypes.timeSheetList.addTimeSheets) {
    return {
      ...state,
      timeSheets: [...state.timeSheets, ...action.data],
    };
  }
  if (action.type === actionTypes.timeSheetList.updateTimeSheets) {
    //Replace existing timesheet with action.data
    let timeSheets = [...state.timeSheets];
    let updatedSheets = action.data;
    updatedSheets.forEach((us) => {
      const origIndex = timeSheets.findIndex((ts) => ts.timeSheetId === us.timeSheetId);
      if (origIndex >= 0) timeSheets[origIndex] = us;
    });
    return {
      ...state,
      timeSheets,
    };
  }

  if (action.type === actionTypes.timeSheetList.deleteTimeSheets) {
    //filter out deleted timesheets from the state
    let timeSheets = [...state.timeSheets];
    let deletedSheets = action.data;
    timeSheets = timeSheets.filter((ts) => !deletedSheets.find((ds) => ds.timeSheetId === ts.timeSheetId));
    return {
      ...state,
      timeSheets,
    };
  }

  return state;
}
export default timeSheetListReducer;
