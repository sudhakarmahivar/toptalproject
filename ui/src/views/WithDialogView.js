import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "material-ui/styles";
const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};
class WithDialogView extends React.Component {
  render() {
    const { open, classes, onClose, children } = this.props;
    console.log(open, onClose, "youare here");
    return (
      <div className="withDialogView">
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <div>{children}</div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(WithDialogView);
