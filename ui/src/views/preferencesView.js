import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//material-ui
import { TextField, Button, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

//app modules
import { saveUser } from "../controllers/userController";
import ServiceStatusView from "./serviceStatusView";
import PageHeaderView from "./pageHeaderView";
import SaveIcon from "@material-ui/icons/Save";
import { clearError } from "../controllers/serviceStatusController";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
});
/**
 * Displays User Preference
 */
class PreferencesView extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    saveUser: PropTypes.func,
    clearError: PropTypes.func,
    classes: PropTypes.object,
  };
  static defaultProps = {
    user: { workingHoursPerDay: 0 },
    classes: {},
    saveUser: () => {},
    clearError: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {
      workingHoursPerDay: this.props.user.workingHoursPerDay,
    };
    props.clearError();
  }
  onWorkingHoursChange = (event) => {
    const hours = Number(event.target.value);
    if (hours > 24 || hours < 0) {
      return;
    }
    this.setState({ workingHoursPerDay: hours });
  };
  onSubmit = (event) => {
    event.preventDefault(); //stop reloading of page
    const { workingHoursPerDay } = this.state;

    const user = this.props.user;
    console.log(user);
    user.workingHoursPerDay = workingHoursPerDay;
    console.log(user);
    this.props.saveUser(user);
  };
  render() {
    const { workingHoursPerDay } = this.state;
    const { classes } = this.props;
    return (
      <div className="preferencesView">
        <PageHeaderView title={`Edit Preferences`} subtitle="Set your preferences here" />
        <Paper className="paperWrapper">
          <form className="preferencesForm" noValidate autoComplete="off" onSubmit={this.onSubmit}>
            <TextField
              id="standard-number"
              label="Working Hours Per Day"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={workingHoursPerDay}
              onChange={this.onWorkingHoursChange}
            />
            <ServiceStatusView />
            <div className="actionPanel">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </div>
            <ServiceStatusView successOnly />
          </form>
        </Paper>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { user: state.authContext };
};
const mapDispatchToProps = {
  saveUser,
  clearError,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PreferencesView));
