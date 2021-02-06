import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { getTimeSheets, showDayTimeSheet } from "../controllers/timeSheetController";

import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { getUserContext } from "../framework/userContext";
/**
 * Displays all users
 */

export class TimeSheetListView extends React.Component {
  columnDefs = [];
  constructor(props) {
    super(props);

    this.state = {
      fromDate: moment().subtract(6, "days").startOf("day").format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD"),
      userId: getUserContext().userId,
    };

    this.columnDefs.push({
      headerName: "Date",
      field: "date",
    });
    this.columnDefs.push({
      headerName: "Total Hours",
      field: "hours",
    });
  }
  componentDidMount() {
    this.onSearch(); //invoke search with default parameter
  }
  onDateChange = (field, date) => {
    this.setState({
      [field]: moment(date).format("YYYY-MM-DD"),
    });
  };
  onSearch = () => {
    const { userId, fromDate, toDate } = this.state;
    this.props.getTimeSheets(fromDate, toDate, userId);
  };
  onDaySelect = ({ data }) => {
    this.props.showDayTimeSheet(data.date);
  };
  render() {
    const timeSheets = this.props.timeSheets;
    //const { confirmationMessage, deleteConfirmationOpen } = this.state;
    //const { editDialogOpen, editUser } = this.state;
    const { fromDate, toDate } = this.state;
    return (
      <div className="timeSheetListView">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            id="fromDate"
            label="From Date"
            value={fromDate}
            onChange={(event) => this.onDateChange("fromDate", event)}
            KeyboardButtonProps={{
              "aria-label": "change from date",
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            id="toDate"
            label="To Date"
            value={toDate}
            onChange={(event) => this.onDateChange("toDate", event)}
            KeyboardButtonProps={{
              "aria-label": "change from date",
            }}
          />
          <Button variant="contained" color="primary" onClick={this.onSearch}>
            Search
          </Button>
        </MuiPickersUtilsProvider>
        <div
          className="ag-theme-alpine"
          style={{
            height: "800px",
            width: "800px",
          }}
        >
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={timeSheets}
            onRowClicked={this.onDaySelect}
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
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  // group activities by date

  let timeSheets = state.timeSheetList.timeSheets;
  let uniqDates = [...new Set(timeSheets.map((ts) => ts.date))];
  let timeSheetSummary = [];
  uniqDates.forEach((uniqDate) => {
    const dayTimeSheets = timeSheets.filter((ts) => ts.date === uniqDate);
    let dailyHours = dayTimeSheets.reduce((pv, ts) => {
      return ts.hours + pv;
    }, 0);
    timeSheetSummary.push({ date: uniqDate, hours: dailyHours });
  });

  return { timeSheets: timeSheetSummary };
};

const mapDispatchToProps = { getTimeSheets, showDayTimeSheet };

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetListView);
