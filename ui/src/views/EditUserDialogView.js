import React from "react";
import { connect } from "react-redux";

import { closeEditUserDialog } from "../controllers/userController";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import RegistrationView from "./registrationView";
import { withStyles } from "material-ui/styles";

/**
 * Displays all users
 */

const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};

export class EditUserDialogView extends React.Component {
  handleClose = () => {
    this.props.closeEditUserDialog();
  };
  render() {
    const { open, users, userId, classes } = this.props;
    if (!open) return null;
    const user = users.find((u) => u.userId === userId);

    return (
      <div className="editUserDialogView">
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
          <DialogContent>
            <DialogContentText>Mandatory fields are marked *</DialogContentText>
            <div>
              <RegistrationView user={user} allowRoleEdit />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return { open: state.editUser.open, userId: state.editUser.userId, users: state.userList.users };
};

const mapDispatchToProps = {
  closeEditUserDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditUserDialogView));
