import actionTypes from "../actionTypes";

const initialState = {
  userId: null,
  fromDate: null,
  toDate: null,
  timeSheets: [],
  date: null,
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
      date: action.data,
    };
  }
  if (action.type === actionTypes.timeSheetList.addTimeSheets) {
    return {
      ...state,
      timeSheets: [...state.timeSheets, ...action.data],
    };
  }
  if (action.type === actionTypes.timeSheetList.updateTimeSheets) {
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
