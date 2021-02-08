import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {
  showDayTimeSheet,
  addTimeSheets,
  updateTimeSheets,
  deleteTimeSheets,
} from "../controllers/timeSheetController";
import Button from "@material-ui/core/Button";
import getNumericCellEditor from "./NumericCellEditor";
import FormErrorView from "./FormErrorView";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PageHeaderView from "./pageHeaderView";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import { getUserContext } from "../framework/userContext";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
/**
 * Displays all users
 */
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
});
/**
 * Displays all users
 */

export class TimeSheetDayView extends React.Component {
  columnDefs = [];

  gridApi = null;
  newRowIndex = -1;
  constructor(props) {
    super(props);
    this.state = {
      totalHours: 0,
      formErrors: [],
      timeSheets: JSON.parse(JSON.stringify(props.timeSheets)),
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
    console.log(timeSheet, "deleted");
    this.gridApi.updateRowData({ remove: [timeSheet] });
    this.validateData();
    return;
  };
  onSummaryClick = () => {
    this.props.showDayTimeSheet(null);
  };
  getAllTimeSheets = () => {
    let timeSheets = [];
    this.gridApi.forEachNode((node) => timeSheets.push(node.data));
    return timeSheets;
  };
  validateData = () => {
    let timeSheets = this.getAllTimeSheets();
    console.log(
      "Validating ",
      timeSheets.map((ts) => ts.activity + "," + ts.hours)
    );

    let errors = [];
    const totalHours = timeSheets.reduce((pv, cv) => pv + cv.hours, 0);
    const blankHours = timeSheets.find((ts) => ts.hours <= 0);
    if (blankHours) errors.push("One or more activities have missing hours");
    if (totalHours > 24) errors.push("Total hours in day cant exceed 24");
    if (timeSheets.length === 0) errors.push("Atleast one activity required");
    const emptyActivities = timeSheets.filter((ts) => (ts.activity || "").replace(" ", "") === "");
    if (emptyActivities.length > 0) errors.push("One or more rows missing activity name");
    this.setState({
      totalHours,
      formErrors: errors,
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
    //currentTimeSheets.push(newRow);
    this.gridApi.updateRowData({ add: [newRow] });

    //get count of last row and set edit focus there
    let row = this.getAllTimeSheets().length;
    this.gridApi.startEditingCell({ rowIndex: row - 1, colKey: "activity" });
    console.log();
  };
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
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
    console.log(originalTimeSheets);

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
    console.log(workingHoursPerDay);
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
  onSubmit = () => {
    let timeSheets = this.getAllTimeSheets();
    let { addTimeSheets, updateTimeSheets, deleteTimeSheets } = this.props;
    //newly added rows
    const newRows = timeSheets.filter((ts) => ts.timeSheetId < 0);
    const oldRows = timeSheets.filter((ts) => ts.timeSheetId >= 0);
    const updatedRows = this.getUpdatedRows(oldRows);
    const deletedRows = this.getDeletedRows(oldRows);

    console.log("New Rows:", newRows);
    console.log("Updated Rows:", updatedRows);
    console.log("deleted Rows:", deletedRows);

    newRows.length > 0 && addTimeSheets(newRows);
    updatedRows.length > 0 && updateTimeSheets(updatedRows);
    deletedRows.length > 0 && deleteTimeSheets(deletedRows);
  };
  onCellValueChanged = () => {
    this.validateData();
  };
  render() {
    let { date, classes } = this.props;
    let { timeSheets } = this.state;
    let { totalHours, formErrors } = this.state;
    let isError = formErrors.length > 0;
    console.log("rendere called", timeSheets);
    return (
      <div className="dayTimeSheetView">
        <PageHeaderView title={`Timesheet for ${date}`} />
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
        <div className="actionPanel">
          <Button variant="outlined" color="secondary" onClick={this.onSummaryClick} startIcon={<ArrowBackIosIcon />}>
            Go To List
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onNewRowClick}
            startIcon={<AddIcon />}
          >
            New Row
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onSubmit}
            disabled={isError}
            startIcon={<SaveIcon />}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  // group activities by date
  let { timeSheets, date, userId } = state.timeSheetList;

  let dayTimeSheets = [];
  if (date) dayTimeSheets = timeSheets.filter((ts) => ts.date === date);

  return { timeSheets: dayTimeSheets, date, userId };
};

const mapDispatchToProps = { showDayTimeSheet, addTimeSheets, updateTimeSheets, deleteTimeSheets };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TimeSheetDayView));
