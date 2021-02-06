import React from "react";
import { connect } from "react-redux";
import TimeSheetDayView from "./timeSheetDayView";
import TimeSheetListView from "./timeSheetListView";
/**
 * Displays all users
 */

export class TimeSheetContainer extends React.Component {
  columnDefs = [];
  constructor(props) {
    super(props);
    this.columnDefs.push({
      headerName: "Date",
      field: "date",
    });
    this.columnDefs.push({
      headerName: "Activity",
      field: "activity",
    });

    this.columnDefs.push({
      headerName: "Hours",
      field: "hours",
    });
  }
  render() {
    const { dayView } = this.props;
    return <div className="timeSheetContainer">{dayView ? <TimeSheetDayView /> : <TimeSheetListView />}</div>;
  }
}
const mapStateToProps = (state, ownProps) => {
  // if specific date is there, show the daily view
  //else show all days view ( hours summary)
  return { dayView: !!state.timeSheetList.date };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetContainer);
