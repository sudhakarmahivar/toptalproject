import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { showDayTimeSheet } from "../controllers/timeSheetController";
import Button from "@material-ui/core/Button";
/**
 * Displays all users
 */

export class TimeSheetDayView extends React.Component {
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
  onSummaryClick = () => {
    this.props.showDayTimeSheet(null);
  };
  render() {
    const { date, timeSheets } = this.props;
    return (
      <div className="dayTimeSheetView">
        <div
          className="ag-theme-alpine"
          style={{
            height: "800px",
            width: "800px",
          }}
        >
          Displaying for : {date}
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={timeSheets}
            // setting default column properties
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              headerComponentFramework: SortableHeaderComponent,
              headerComponentParams: {
                menuIcon: "fa-bars",
              },
            }}
          ></AgGridReact>
          <Button href="#text-buttons" color="primary" onClick={this.onSummaryClick}>
            Back to Summary
          </Button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  // group activities by date
  let timeSheets = state.timeSheetList.timeSheets;
  const date = state.timeSheetList.date;
  let dayTimeSheets = [];
  if (date) dayTimeSheets = timeSheets.filter((ts) => ts.date === date);
  return { timeSheets: dayTimeSheets, date };
};

const mapDispatchToProps = { showDayTimeSheet };

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetDayView);
