import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";

/**
 * Displays all users
 */

const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};
/**
 * Confirmation Dialog for delete and other critical actions
 */
export class ConfirmationDialogView extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okHandler: PropTypes.func,
    cancelHandler: PropTypes.func,
    classes: PropTypes.object,
  };
  static defaultProps = {
    open: false,
    title: null,
    message: null,
    okText: null,
    cancelText: null,
    okHandler: null,
    cancelHandler: null,
    classes: {},
  };
  render() {
    const { open, title, message, okText = "OK", cancelText = "Cancel", okHandler, cancelHandler } = this.props;
    return (
      <div className="confirmationDialogView">
        <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={okHandler} color="primary">
              {okText}
            </Button>
            <Button onClick={cancelHandler} color="primary" autoFocus>
              {cancelText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ConfirmationDialogView);
