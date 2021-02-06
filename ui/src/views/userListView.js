import React from "react";
import { connect } from "react-redux";
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { getUsers, deleteUser } from "../controllers/userController";

import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmationDialogView from "./ConfirmationDialogView";
//import RegistrationDialogView from "./RegistrationDialogView";
import WithDialogView from "./WithDialogView";
import RegistrationView from "./registrationView";
/**
 * Displays all users
 */

export class UserListView extends React.Component {
  columnDefs = [];
  constructor(props) {
    super(props);
    const roleNames = {
      u: "User",
      a: "Admin",
      m: "Manager",
    };
    this.state = {
      editDialogOpen: false,
      editUser: null,

      //on delete
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
      valueFormatter: (params) => {
        return roleNames[params.value];
      },
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
    const user = props.value.rowData;
    return (
      <IconButton
        aria-label="edit"
        onClick={() => {
          this.setState({
            editDialogOpen: true,
            editUser: user,
          });
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    );
  }
  deleteUser = () => {
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
  onCreateUser = () => {
    this.setState({
      editDialogOpen: true,
      editUser: null,
    });
  };
  componentDidMount() {
    const { getUsers } = this.props;
    getUsers();
  }
  closeDialog = () => {
    this.setState({
      editDialogOpen: false,
      editUser: null,
    });
  };

  render() {
    const users = this.props.userList.users;
    const { confirmationMessage, deleteConfirmationOpen } = this.state;
    const { editDialogOpen, editUser } = this.state;
    if (!users || users.length === 0) return null;
    return (
      <div className="userListView">
        <Button variant="contained" color="primary" onClick={this.onCreateUser}>
          New User
        </Button>
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
        <WithDialogView open={editDialogOpen} onClose={this.closeDialog}>
          <RegistrationView user={editUser} allowRoleEdit onSuccess={this.closeDialog} />
        </WithDialogView>
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
  editDialogOpen: state.editUser.open,
  editUser: state.editUser.user,
});

const mapDispatchToProps = {
  getUsers,
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
