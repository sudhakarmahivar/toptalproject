import React from "react";
import { connect } from "react-redux";
//material-ui
import { Button, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

//ag-grid
import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

//app-modules
import { getUsers, deleteUser } from "../controllers/userController";
import PageHeaderView from "./pageHeaderView";
import ConfirmationDialogView from "./ConfirmationDialogView";
import WithDialogView from "./WithDialogView";
import RegistrationView from "./registrationView";
import ServiceStatusView from "./serviceStatusView";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  gridHeader: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
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
      width: 100,
    });
    this.columnDefs.push({
      headerName: "Name",
      field: "name",
      flex: 2,
    });
    this.columnDefs.push({
      headerName: "Email",
      field: "email",
      flex: 1,
    });
    this.columnDefs.push({
      headerName: "Role",
      field: "role",
      width: 100,
      valueFormatter: (params) => {
        return roleNames[params.value];
      },
    });
    this.columnDefs.push({
      cellRenderer: "EditLinkRenderer",
      resizable: false,
      width: 75,
      valueGetter: (params) => ({
        rowData: params.data,
      }),
    });
    this.columnDefs.push({
      cellRenderer: "DeleteButtonRenderer",
      resizable: false,
      width: 75,
      valueGetter: (params) => ({
        rowData: params.data,
      }),
    });
  }
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };
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
      confirmationMessage: "You are about to delete user:" + user.name,
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
    const { confirmationMessage, deleteConfirmationOpen, editDialogOpen, editUser } = this.state;
    const { classes } = this.props;
    let dialogTitle = "Create user";
    if (editUser) {
      dialogTitle = "Edit User";
    }
    return (
      <div className="userListView">
        <PageHeaderView title={`Manage Users`} subtitle={"You can edit, delete users from here"} />
        <div className={classes.gridHeader}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onCreateUser}
            startIcon={<AddIcon />}
          >
            Add User
          </Button>
          <ServiceStatusView successOnly />
        </div>
        <div
          className="ag-theme-alpine"
          style={{
            width: "100%",
          }}
        >
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={users}
            enableCellTextSelection
            domLayout="autoHeight"
            pagination={true}
            paginationPageSize={10}
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
            onGridReady={this.onGridReady}
            frameworkComponents={{
              EditLinkRenderer: this.EditLinkRenderer.bind(this),
              DeleteButtonRenderer: this.DeleteButtonRenderer.bind(this),
            }}
          ></AgGridReact>
        </div>
        <WithDialogView open={editDialogOpen} onClose={this.closeDialog} title={dialogTitle}>
          <RegistrationView user={editUser} allowRoleEdit onSuccess={this.closeDialog} onCancel={this.closeDialog} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserListView));
