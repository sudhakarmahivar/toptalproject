import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { authenticate } from "../controllers/loginController";
import { Link } from "react-router-dom";
import ServiceErrorView from "./ServiceErrorView";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
  },
});
class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      password: null,
      nameError: false,
      passwordError: false,
    };
  }
  onNameChange = ({ target }) => {
    this.setState({
      name: target.value,
    });
  };
  onPasswordChange = ({ target }) => {
    this.setState({
      password: target.value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault(); //stop reloading of page
    const { name, password } = this.state;
    const { authenticate } = this.props;

    let nameError = false,
      passwordError = false;
    if (!name) nameError = true;
    if (!password) passwordError = true;
    this.setState({ nameError, passwordError });
    if (nameError || passwordError) return;
    authenticate(name, password);
  };
  render() {
    const { nameError, passwordError } = this.state;
    const { classes } = this.props;
    return (
      <div className="loginView">
        <Paper className="paperWrapper">
          <form className={classes.root} noValidate autoComplete="off" onSubmit={this.onSubmit}>
            <div>
              <TextField
                required
                id="userName"
                fullWidth={true}
                error={nameError}
                label="User Name"
                onChange={this.onNameChange}
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
                onChange={this.onPasswordChange}
              />
            </div>
            <div>
              <ServiceErrorView />
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
const mapStateToProps = (state, ownProps) => ({});
const mapDispatchToProps = {
  authenticate,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginView));
