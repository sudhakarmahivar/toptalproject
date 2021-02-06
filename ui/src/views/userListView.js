import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { getUsers, openEditUserDialog, deleteUser } from "../controllers/userController";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EditUserDialogView from "./EditUserDialogView";
import ConfirmationDialogView from "./ConfirmationDialogView";
/**
 * Displays all users
 */

export class UserListView extends React.Component {
  columnDefs = [];
  constructor(props) {
    super(props);
    this.state = {
      editDialogOpen: false,
      deleteConfirmationOpen: false,
      confirmationMessage: null,
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
  deleteUser = () => {
    console.log("Proceeding withdelete:", this.state.deleteUserId);
    const { deleteUser } = this.props;
    const { deleteUserId: userId } = this.state;
    deleteUser(userId);
    this.setState({
      deleteConfirmationOpen: false,
    });
  };
  cancelDelete = () => {
    this.setState({
      deleteConfirmationOpen: false,
    });
  };

  onDelete = (user) => {
    console.log("You are deleted user", user);
    this.setState({
      deleteConfirmationOpen: true,
      confirmationMessage: "You are about to delete user:" + user.userName,
      deleteUserId: user.userId,
    });
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
  componentDidMount() {
    const { getUsers } = this.props;
    getUsers();
  }

  render() {
    const users = this.props.userList.users;
    const { confirmationMessage, deleteConfirmationOpen } = this.state;
    if (!users || users.length === 0) return null;
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
            rowData={users}
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
        <ConfirmationDialogView
          open={deleteConfirmationOpen}
          title="Confirm User Delete"
          message={confirmationMessage}
          okText="Delete"
          okHandler={this.deleteUser}
          cancelHandler={this.cancelDelete}
        />
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
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
