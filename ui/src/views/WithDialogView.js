import React from "react";

import { withStyles } from "material-ui/styles";
import { DialogTitle, DialogContentText, DialogContent, Dialog } from "@material-ui/core";

const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};
/**
 * HOC Component - Wraps child component in dialog
 */
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
