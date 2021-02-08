import React from "react";
import { connect } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
//material-ui
import { Button, IconButton, Paper } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import { withStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

//ag-grid
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

//app modules
import PageHeaderView from "./pageHeaderView";
import { getUserContext } from "../framework/userContext";
import {
  showDayTimeSheet,
  addTimeSheets,
  updateTimeSheets,
  deleteTimeSheets,
} from "../controllers/timeSheetController";
import getNumericCellEditor from "./NumericCellEditor";
import FormErrorView from "./FormErrorView";
import ServiceStatusView from "./serviceStatusView";
import messages from "../messages";
import utils from "../framework/utils";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  gridTotalSection: {
    display: "flex",
  },
  totalHoursPaper: {
    flexGrow: 1,
    marginLeft: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  totalHoursTitle: {
    fontSize: 40,
  },
  totalHoursValue: {
    marginTop: 20,
    fontSize: 70,
  },
  green: {
    color: "green",
  },
  actionPanel: {
    width: "65%",
  },
  gridHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "65%",
    alignItems: "flex-end",
  },
});

/**
 * Displays Daily Timesheet ( list of activities of the day)
 * User can change date and fill in if required
 */

export class TimeSheetDayView extends React.Component {
  columnDefs = [];
  gridApi = null;
  newRowIndex = -1; //new row added. index.
  constructor(props) {
    super(props);
    this.state = {
      totalHours: 0,
      formErrors: [],
      timeSheets: JSON.parse(JSON.stringify(props.timeSheets)),
      date: props.date,
    };
    this.columnDefs.push({
      headerName: "Activity",
      field: "activity",
      editable: true,
    });

    this.columnDefs.push({
      headerName: "Hours",
      field: "hours",
      type: "numericColumn",
      cellEditor: "numericCellEditor",
      editable: true,
      width: 75,
      maxWidth: 75,
    });
    this.columnDefs.push({
      cellRenderer: "DeleteButtonRenderer",
      valueGetter: (params) => ({
        rowData: params.data,
      }),
      width: 75,
      maxWidth: 75,
    });
  }

  onDelete = (timeSheet) => {
    this.gridApi.updateRowData({ remove: [timeSheet] });
    this.validateData();
    return;
  };
  onSummaryClick = () => {
    this.props.showDayTimeSheet(null, this.props.userId);
  };
  getAllTimeSheets = () => {
    let timeSheets = [];
    this.gridApi.forEachNode((node) => timeSheets.push(node.data));
    return timeSheets;
  };
  validateData = () => {
    let timeSheets = this.getAllTimeSheets();
    let errors = [];
    const totalHours = timeSheets.reduce((pv, cv) => pv + cv.hours, 0);
    const blankHours = timeSheets.find((ts) => ts.hours <= 0);
    if (blankHours) errors.push(messages.activityMissingHours);
    if (totalHours > 24) errors.push(messages.totalHoursExceed24);
    const emptyActivities = timeSheets.filter((ts) => (ts.activity || "").replace(" ", "") === "");
    if (emptyActivities.length > 0) errors.push(messages.activityMissingName);
    const changes = this.getDelta().totalChanges;
    this.setState({
      totalHours,
      formErrors: errors,
      submitEnabled: changes && errors.length === 0,
    });
  };

  onNewRowClick = () => {
    let newRow = {
      date: this.props.date,
      timeSheetId: this.newRowIndex--,
      activity: "Enter your activity here",
      hours: 0,
      userId: this.props.userId,
    };
    this.gridApi.updateRowData({ add: [newRow] });

    //get count of last row and set edit focus there
    let row = this.getAllTimeSheets().length;
    this.gridApi.startEditingCell({ rowIndex: row - 1, colKey: "activity" });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    //now data is ready, do a round of validation.
    this.validateData();
  };

  DeleteButtonRenderer(props) {
    const user = props.value.rowData;
    return (
      <IconButton
        aria-label="delete"
        onClick={() => {
          this.onDelete(user);
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    );
  }
  getUpdatedRows = (gridRows) => {
    const originalTimeSheets = this.props.timeSheets;

    return gridRows.filter((row) => {
      const orig = originalTimeSheets.find((t) => t.timeSheetId === row.timeSheetId);
      return orig.activity !== row.activity || orig.hours !== row.hours;
    });
  };

  getDeletedRows = (gridRows) => {
    //iterate and see if rows are not in original list
    const originalTimeSheets = this.props.timeSheets;
    return originalTimeSheets.filter((ots) => !gridRows.find((r) => r.timeSheetId === ots.timeSheetId));
  };

  getTotalHoursDisplay = (total) => {
    const { workingHoursPerDay = 0 } = getUserContext();
    const { classes } = this.props;
    const targetMetStyle = total >= workingHoursPerDay ? classes.green : "";

    return (
      <Paper className={classes.totalHoursPaper}>
        <div className={classes.totalHoursTitle}>Total Hours</div>
        <div className={`${classes.totalHoursValue} ${targetMetStyle}`}>{total}</div>
        <div></div>
      </Paper>
    );
  };
  getDelta = () => {
    let timeSheets = this.getAllTimeSheets();

    //newly added rows
    const newRows = timeSheets.filter((ts) => ts.timeSheetId < 0);
    const oldRows = timeSheets.filter((ts) => ts.timeSheetId >= 0);
    const updatedRows = this.getUpdatedRows(oldRows);
    const deletedRows = this.getDeletedRows(oldRows);
    return {
      newRows,
      updatedRows,
      deletedRows,
      totalChanges: newRows.length + updatedRows.length + deletedRows.length,
    };
  };
  onSubmit = () => {
    const { newRows, updatedRows, deletedRows } = this.getDelta();
    let { addTimeSheets, updateTimeSheets, deleteTimeSheets } = this.props;
    newRows.length > 0 && addTimeSheets(newRows);
    updatedRows.length > 0 && updateTimeSheets(updatedRows);
    deletedRows.length > 0 && deleteTimeSheets(deletedRows);
  };
  onCellValueChanged = () => {
    this.validateData();
  };
  componentDidMount = () => {
    this.clearErrors();
  };
  componentDidUpdate = (prevProps) => {
    //check if user has changed date, if so reset data
    const { date, timeSheets } = this.props;
    if (date !== prevProps.date) {
      this.setState({
        totalHours: 0,
        formErrors: [],
        timeSheets: JSON.parse(JSON.stringify(timeSheets)),
        date,
      });
      //Force a validation after a second. Given validation is based on table rows
      //it will take a sec to render
      setTimeout(() => this.validateData(), 500);
    }
  };
  clearErrors = () => {
    this.setState({
      formErrors: [], //clear
    });
  };
  onDateChange = (date) => {
    this.props.showDayTimeSheet(utils.getFormattedDate(date), this.props.userId);
    this.clearErrors();
  };
  render() {
    let { classes, userId, users } = this.props;
    let { submitEnabled, timeSheets, date, totalHours, formErrors } = this.state;
    const name = (users.find((user) => user.userId === userId) || {}).name;
    const maxDate = new Date(),
      minDate = moment().subtract(1, "year").toDate();
    return (
      <div className="dayTimeSheetView">
        <PageHeaderView title={`Timesheet for ${date}, for ${name}`} />
        <div className={classes.gridHeader}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-dd"
              margin="normal"
              id="date"
              label="Select Date"
              value={date}
              onChange={this.onDateChange}
              KeyboardButtonProps={{
                "aria-label": "Select Date",
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
            onClick={this.onNewRowClick}
            startIcon={<AddIcon />}
          >
            New Row
          </Button>
        </div>
        <div className={classes.gridTotalSection}>
          <div
            className="ag-theme-alpine"
            style={{
              width: "65%",
              height: "100%",
            }}
          >
            <AgGridReact
              columnDefs={this.columnDefs}
              rowData={timeSheets}
              stopEditingWhenGridLosesFocus={true}
              //editType="fullRow"
              components={{
                numericCellEditor: getNumericCellEditor(0, 24),
              }}
              frameworkComponents={{
                DeleteButtonRenderer: this.DeleteButtonRenderer.bind(this),
              }}
              onGridReady={this.onGridReady}
              onRowValueChanged={this.onRowValueChanged}
              domLayout="autoHeight"
              pagination={true}
              paginationPageSize={10}
              // setting default column properties
              defaultColDef={{
                sortable: true,
                singleClickEdit: true,
                onCellValueChanged: this.onCellValueChanged,
                resizable: true,
                headerComponentFramework: SortableHeaderComponent,
                headerComponentParams: {
                  menuIcon: "fa-bars",
                },
              }}
            ></AgGridReact>
          </div>
          {this.getTotalHoursDisplay(totalHours)}
        </div>
        <FormErrorView messages={formErrors} />
        <ServiceStatusView />
        <div className={`actionPanel ${classes.actionPanel}`}>
          <Button variant="outlined" color="secondary" onClick={this.onSummaryClick} startIcon={<ArrowBackIosIcon />}>
            Go To List
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onSubmit}
            disabled={!submitEnabled}
            startIcon={<SaveIcon />}
          >
            Submit
          </Button>
        </div>
        <ServiceStatusView successOnly />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  // group activities by date
  let { timeSheets, date, userId } = state.timeSheetList;
  let dayTimeSheets = [];
  if (date) dayTimeSheets = timeSheets.filter((ts) => ts.date === date);
  return { timeSheets: dayTimeSheets, date, userId, users: state.userList.users };
};

const mapDispatchToProps = { showDayTimeSheet, addTimeSheets, updateTimeSheets, deleteTimeSheets };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TimeSheetDayView));
