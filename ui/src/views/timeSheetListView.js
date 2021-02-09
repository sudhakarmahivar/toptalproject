import React from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import PropTypes from "prop-types";

//material-ui
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { Paper, Select, FormControl, MenuItem, Button, InputLabel } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
//ag-grid
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
//app modules
import { getTimeSheets, showDayTimeSheet } from "../controllers/timeSheetController";
import { getUsers } from "../controllers/userController";
import PageHeaderView from "./pageHeaderView";
import { getUserContext } from "../framework/userContext";
import utils from "../framework/utils";

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
    fontSize: "small",
  },
  userSelector: {
    width: 250,
  },
  button: {
    margin: theme.spacing(1),
  },
  gridHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSelectSearchPanel: {
    display: "flex",
  },
  activitiesList: {
    marginTop: 12,
    marginBottom: 1,
    "& li": {
      lineHeight: "15px",
    },
  },
  selectUserPaper: {
    padding: 8,
    marginRight: 20,
  },
  searchPanelPaper: {
    padding: 2,
  },
});
/**
 * Displays Timesheets, with feature to see other user timesheets, search date range
 */

export class TimeSheetListView extends React.Component {
  static propTypes = {
    timeSheets: PropTypes.arrayOf(PropTypes.object),
    users: PropTypes.arrayOf(PropTypes.object),
    toDate: PropTypes.string,
    fromDate: PropTypes.string,
    userId: PropTypes.func,
    classes: PropTypes.object,
    getTimeSheets: PropTypes.func,
    getUsers: PropTypes.func,
    showDayTimeSheet: PropTypes.func,
  };
  static defaultProps = {
    timeSheets: [],
    users: [],
    toDate: null,
    fromDate: null,
    userId: null,
    classes: {},
    getTimeSheets: () => {},
    getUsers: () => {},
    showDayTimeSheet: () => {},
  };
  columnDefs = [];
  constructor(props) {
    super(props);

    const userContext = getUserContext();
    this.state = {
      fromDate: props.fromDate || utils.getFormattedDate(moment().subtract(6, "days").startOf("day")),
      toDate: props.toDate || utils.getFormattedDate(),
      userId: props.userId || userContext.userId,
    };

    this.columnDefs.push({
      headerName: "Date",
      field: "date",
      width: 50,
    });
    this.columnDefs.push({
      headerName: "Total Hours",
      field: "hours",
      width: 50,
    });
    this.columnDefs.push({
      headerName: "Activities",
      field: "activities",
      autoHeight: true,
      cellRenderer: "ActivitiesRenderer",
    });
  }
  ActivitiesRenderer(props) {
    const activities = props.value;

    const listItems = activities.map((activity) => <li>{activity}</li>);
    return <ul className={this.props.classes.activitiesList}>{listItems}</ul>;
  }
  componentDidMount() {
    this.searchTimeSheets(); //invoke search with default parameter
    this.props.getUsers(); //get list of users
  }

  onDateChange = (field, date) => {
    this.setState({
      [field]: utils.getFormattedDate(date),
    });
  };
  onSearchClick = () => {
    this.searchTimeSheets();
  };
  searchTimeSheets = (userIdInput) => {
    const { userId, fromDate, toDate } = this.state;
    this.props.getTimeSheets(fromDate, toDate, userIdInput || userId);
  };
  addTimeSheet = () => {
    //default to today's date
    this.props.showDayTimeSheet(utils.getFormattedDate(), this.state.userId);
  };
  onDaySelect = ({ data }) => {
    this.props.showDayTimeSheet(data.date, this.state.userId);
  };
  onUserSelect = ({ target }) => {
    this.setState({
      userId: target.value,
    });
    this.searchTimeSheets(target.value);
  };
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };
  setRowHeight = (params) => {
    let count = params.data.activities.length;
    return count <= 1 ? 50 : count * 25;
  };
  render() {
    const { timeSheets, users, classes } = this.props;
    const sortedUsers = users.sort((a, b) => {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });

    const { fromDate, toDate, userId } = this.state; //current user selected stuff
    const { fromDate: resultFromDate, toDate: resultToDate, userId: resultUserId } = this.props;
    const name = (users.find((user) => user.userId === resultUserId) || {}).name;
    const showSelectUser = utils.isManagerOrAdmin(getUserContext().role);
    const maxDate = new Date(),
      minDate = moment().subtract(1, "year").toDate();
    return (
      <div className="timeSheetListView">
        <PageHeaderView title={`Manage Timesheets`} />
        <div className={classes.userSelectSearchPanel}>
          {showSelectUser && (
            <Paper className={classes.selectUserPaper}>
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
            </Paper>
          )}

          <Paper className={classes.searchPanelPaper}>
            <div className={classes.searchPanel}>
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
                  maxDate={maxDate}
                  minDate={minDate}
                  autoOk={true}
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
                  maxDate={maxDate}
                  minDate={minDate}
                  autoOk={true}
                />
              </MuiPickersUtilsProvider>

              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SearchIcon />}
                onClick={this.onSearchClick}
              >
                Search
              </Button>
            </div>
          </Paper>
        </div>
        <div className={classes.gridHeader}>
          <div className={classes.resultsSummary}>
            Displaying Timesheets of {name} for period {resultFromDate} to {resultToDate}
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.addTimeSheet}
            startIcon={<AddIcon />}
          >
            Add Timesheet
          </Button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={timeSheets}
            domLayout="autoHeight"
            onRowClicked={this.onDaySelect}
            onGridReady={this.onGridReady}
            pagination={true}
            getRowHeight={this.setRowHeight}
            paginationPageSize={10}
            rowClassRules={{
              lowWorkingHours: (params) => {
                return params.data.hours < getUserContext().workingHoursPerDay;
              },
            }}
            frameworkComponents={{
              ActivitiesRenderer: this.ActivitiesRenderer.bind(this),
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
const mapStateToProps = (state) => {
  // group activities by date
  let { timeSheets, fromDate, toDate, userId } = state.timeSheetList;
  const users = state.userList.users;
  let uniqDates = [...new Set(timeSheets.map((ts) => ts.date))];
  let timeSheetSummary = [];
  uniqDates.forEach((uniqDate) => {
    const dayTimeSheets = timeSheets.filter((ts) => ts.date === uniqDate);
    let dailyHours = dayTimeSheets.reduce((pv, ts) => {
      return ts.hours + pv;
    }, 0);
    let activities = dayTimeSheets.map((dts) => dts.activity);
    timeSheetSummary.push({ date: uniqDate, hours: dailyHours, activities });
  });
  timeSheetSummary.sort((a, b) => (b.date > a.date ? 1 : -1));
  return { timeSheets: timeSheetSummary, users, fromDate, toDate, userId };
};

const mapDispatchToProps = { getTimeSheets, getUsers, showDayTimeSheet };
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TimeSheetListView));
