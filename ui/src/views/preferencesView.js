import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { saveUser } from "../controllers/userController";
import ServiceErrorView from "./ServiceErrorView";
import { getUserContext } from "../framework/userContext";
import PageHeaderView from "./pageHeaderView";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import FormErrorView from "./FormErrorView";

/**
 * Displays all users
 */
const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
});
class PreferencesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workingHoursPerDay: this.props.user.workingHoursPerDay,
    };
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
    user.workingHoursPerDay = workingHoursPerDay;
    this.props.saveUser(user);
  };
  render() {
    const { workingHoursPerDay } = this.state;
    const { classes } = this.props;
    console.log(workingHoursPerDay, "workingHoursPerDay");
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

            <ServiceErrorView />

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
          </form>
        </Paper>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return { user: getUserContext() };
};
const mapDispatchToProps = {
  saveUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PreferencesView));
