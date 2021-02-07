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
    });
    this.columnDefs.push({
      cellRenderer: "DeleteButtonRenderer",
      valueGetter: (params) => ({
        rowData: params.data,
      }),
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
    };
    //currentTimeSheets.push(newRow);
    this.gridApi.updateRowData({ add: [newRow] });

    //get count of last row and set edit focus there
    let row = this.getAllTimeSheets().length;
    this.gridApi.startEditingCell({ rowIndex: row - 1, colKey: "activity" });
    console.log();
  };
  onGridReady = (params) => {
    // placing in 13 rows, so there are exactly enough rows to fill the grid, makes
    //DeleteButtonRenderer
    // the row animation look nice when you see all the rows
    this.gridApi = params.api;
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
    let { date } = this.props;
    let { timeSheets } = this.state;
    let { totalHours, formErrors } = this.state;
    let isError = formErrors.length > 0;
    console.log("rendere called", timeSheets);
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
          <div>Total Hours: {totalHours}</div>
          <div>
            <FormErrorView messages={formErrors} />
          </div>
          <Button href="#text-buttons" color="primary" onClick={this.onSummaryClick}>
            Back to Summary
          </Button>
          <Button color="primary" onClick={this.onNewRowClick}>
            Add New Row
          </Button>
          <Button color="primary" onClick={this.onCancelClick}>
            Cancel{" "}
          </Button>
          <Button color="primary" onClick={this.onSubmit} disabled={isError}>
            Save Timeseet
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

const mapDispatchToProps = { showDayTimeSheet, addTimeSheets, updateTimeSheets, deleteTimeSheets };

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetDayView);
