import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import { getUsers, openEditUserDialog } from "../controllers/userController";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditUserDialogView from "./EditUserDialogView";
/**
 * Displays all users
 */

export class UserListView extends React.Component {
  columnDefs = [];
  constructor(props) {
    super(props);
    this.state = {
      editDialogOpen: false,
    };

    this.columnDefs.push({
      headerName: "User Name",
      field: "userName",
    });
    this.columnDefs.push({
      headerName: "Role",
      field: "role",
    });
    this.columnDefs.push({
      cellRenderer: "EditLinkRenderer",
      valueGetter: (params) => ({
        rowData: params.data,
      }),
    });
    this.columnDefs.push({
      cellRenderer: "DeleteButtonRenderer",
      valueGetter: (params) => ({
        rowData: params.data,
      }),
    });
  }
  EditLinkRenderer(props) {
    const { userId } = props.value.rowData;
    const user = this.props.userList.data.find((user) => user.userId === userId);
    return (
      <IconButton
        aria-label="edit"
        onClick={() => {
          this.props.openEditUserDialog(userId);
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    );
  }
  DeleteButtonRenderer(props) {
    const { userId } = props.value.rowData;
    return (
      <IconButton aria-label="delete">
        <DeleteIcon fontSize="small" />
      </IconButton>
    );
  }
  componentDidMount() {
    console.log("Did mount");
    const { getUsers } = this.props;
    getUsers();
  }

  render() {
    const userList = this.props.userList.data;
    const classes = {};
    const dialogOpen = true;
    console.log(this.state.editDialogOpen);
    if (!userList || userList.length === 0) return null;
    return (
      <div className="userListView">
        <div
          className="ag-theme-alpine"
          style={{
            height: "800px",
            width: "800px",
          }}
        >
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={userList}
            enableCellTextSelection
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
            frameworkComponents={{
              EditLinkRenderer: this.EditLinkRenderer.bind(this),
              DeleteButtonRenderer: this.DeleteButtonRenderer.bind(this),
            }}
          ></AgGridReact>
        </div>
        <EditUserDialogView />
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  userList: state.userList,
});

const mapDispatchToProps = {
  getUsers,
  openEditUserDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
