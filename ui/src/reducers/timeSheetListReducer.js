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
  return state;
}
export default timeSheetListReducer;
