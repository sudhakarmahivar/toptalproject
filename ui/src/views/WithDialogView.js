import React from "react";
import PropTypes from "prop-types";

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
  static propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.object,
    onClose: PropTypes.func,
    classes: PropTypes.object,
  };
  static defaultProps = {
    open: false,
    title: null,
    subtitle: null,
    children: null,
    onClose: () => {},
    classes: {},
  };
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
