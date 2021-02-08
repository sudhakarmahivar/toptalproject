import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "material-ui/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};
class WithDialogView extends React.Component {
  render() {
    const { open, classes, onClose, children, title, subtitle } = this.props;
    return (
      <div className="withDialogView">
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}

          <DialogContent>
            {subtitle && <DialogContentText>{subtitle}</DialogContentText>}
            <div>{children}</div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(WithDialogView);
