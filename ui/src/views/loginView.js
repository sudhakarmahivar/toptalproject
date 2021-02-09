import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//material-ui
import { Button, Paper, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

//app modules
import { authenticate } from "../controllers/loginController";
import ServiceStatusView from "./serviceStatusView";
import { clearError } from "../controllers/serviceStatusController";

const styles = (theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
  },
});
/**
 * Login View. Does username , password authentication
 */
export class LoginView extends React.Component {
  static propTypes = {
    authenticate: PropTypes.func,
    clearError: PropTypes.func,
    classes: PropTypes.object,
  };
  static defaultProps = {
    authenticate: () => {},
    clearError: () => {},
    classes: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      password: null,
      userNameError: false,
      passwordError: false,
    };
    props.clearError();
  }

  onFieldChange = ({ target }, field) => {
    this.setState({
      [field]: target.value,
    });
  };
  onSubmit = (event) => {
    event.preventDefault(); //stop reloading of page
    const { userName, password } = this.state;
    const { authenticate } = this.props;

    let userNameError = false,
      passwordError = false;
    if (!userName) userNameError = true;
    if (!password) passwordError = true;
    this.setState({ userNameError, passwordError });
    if (userNameError || passwordError) return;
    authenticate(userName, password);
  };
  render() {
    const { userNameError, passwordError } = this.state;
    const { classes } = this.props;
    return (
      <div className="loginView">
        <Paper className="paperWrapper">
          <ServiceStatusView successOnly />
          <form className={classes.root} noValidate autoComplete="off" onSubmit={this.onSubmit}>
            <div>
              <TextField
                required
                id="userName"
                fullWidth={true}
                error={userNameError}
                label="User Name"
                onChange={(e) => this.onFieldChange(e, "userName")}
              />
            </div>
            <div>
              <TextField
                id="password"
                required
                error={passwordError}
                label="Password"
                type="password"
                fullWidth={true}
                onChange={(e) => this.onFieldChange(e, "password")}
              />
            </div>
            <div>
              <ServiceStatusView />
            </div>
            <div className="actionPanel">
              <Button variant="contained" color="primary" type="submit" className="loginButton">
                Login
              </Button>
              <Link to="/registration">New User? Click here to register</Link>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

const mapDispatchToProps = {
  authenticate,
  clearError,
};
export default connect(null, mapDispatchToProps)(withStyles(styles)(LoginView));
