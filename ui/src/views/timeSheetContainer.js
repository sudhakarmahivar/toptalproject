import React from "react";
import { connect } from "react-redux";
import TimeSheetDayView from "./timeSheetDayView";
import TimeSheetListView from "./timeSheetListView";
/**
 * Container for TimeSheet List View and TimeSheet Daily activity views
 */
export class TimeSheetContainer extends React.Component {
  render() {
    const { dayView } = this.props;
    return <div className="timeSheetContainer">{dayView ? <TimeSheetDayView /> : <TimeSheetListView />}</div>;
  }
}
const mapStateToProps = (state) => {
  // if specific date is there, show the daily view
  //else show all timesheet list
  return { dayView: !!state.timeSheetList.date };
};
export default connect(mapStateToProps)(TimeSheetContainer);
