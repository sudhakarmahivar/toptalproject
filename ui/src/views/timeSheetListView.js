import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { getTimeSheets, showDayTimeSheet } from "../controllers/timeSheetController";
import { getUsers } from "../controllers/userController";
import PageHeaderView from "./pageHeaderView";

import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SearchIcon from "@material-ui/icons/Search";

import moment from "moment";
import { getUserContext } from "../framework/userContext";
import { Paper } from "@material-ui/core";
/**
 * Displays all users
 */
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  searchPanel: {
    display: "flex",
    alignItems: "flex-end",
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(1),
    },
  },
  resultsSummary: {
    marginTop: 5,
    marginBottom: 5,
  },
  userSelector: {
    width: 250,
  },
  button: {
    margin: theme.spacing(1),
  },
});

export class TimeSheetListView extends React.Component {
  columnDefs = [];
  constructor(props) {
    super(props);

    this.state = {
      fromDate: moment().subtract(6, "days").startOf("day").format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD"),
      userId: props.userId || getUserContext().userId,
      workingHoursPerDay: Number(getUserContext().workingHoursPerDay),
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
    this.props.getUsers(); //get list of users
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
  onUserSelect = ({ target }) => {
    this.setState({
      userId: target.value,
    });
  };
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };
  render() {
    const { timeSheets, users, classes } = this.props;
    //const { confirmationMessage, deleteConfirmationOpen } = this.state;
    //const { editDialogOpen, editUser } = this.state;

    const sortedUsers = users.sort((a, b) => {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });

    const { fromDate, toDate, userId } = this.state;
    const name = (users.find((user) => user.userId === userId) || {}).name;

    return (
      <div className="timeSheetListView">
        <PageHeaderView
          title={`Manage Timesheets`}
          subtitle={"Search timesheets through date range. Click on any of the timesheet to open activity details page"}
        />
        <Paper className="paperWrapper">
          <div className={classes.searchPanel}>
            <FormControl className={classes.userSelector}>
              <InputLabel id="demo-simple-select-label">Select User</InputLabel>
              <Select labelId="demo-simple-select-label" id="user" value={userId} onChange={this.onUserSelect}>
                {sortedUsers.map(({ userId, name }) => (
                  <MenuItem value={userId} key={userId}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            </MuiPickersUtilsProvider>

            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SearchIcon />}
              onClick={this.onSearch}
            >
              Search
            </Button>
          </div>
        </Paper>
        <div className={classes.resultsSummary}>
          Displaying Timesheets of {name} for period {fromDate} to {toDate}
        </div>
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
            domLayout="autoHeight"
            onRowClicked={this.onDaySelect}
            onGridReady={this.onGridReady}
            pagination={true}
            paginationPageSize={10}
            rowClassRules={{
              lowWorkingHours: (params) => {
                return params.data.hours < getUserContext().workingHoursPerDay;
              },
              "sick-days-breach": "data.sickDays >= 8",
            }}
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
  const users = state.userList.users;
  let uniqDates = [...new Set(timeSheets.map((ts) => ts.date))];
  let timeSheetSummary = [];
  uniqDates.forEach((uniqDate) => {
    const dayTimeSheets = timeSheets.filter((ts) => ts.date === uniqDate);
    let dailyHours = dayTimeSheets.reduce((pv, ts) => {
      return ts.hours + pv;
    }, 0);
    timeSheetSummary.push({ date: uniqDate, hours: dailyHours });
  });

  return { timeSheets: timeSheetSummary, users };
};

const mapDispatchToProps = { getTimeSheets, getUsers, showDayTimeSheet };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TimeSheetListView));
