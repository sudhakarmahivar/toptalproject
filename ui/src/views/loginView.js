import React from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { authenticate } from "../controllers/loginController";
import { Link } from "react-router-dom";
import ServiceErrorView from "./ServiceErrorView";
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
    return (
      <div className="loginView">
        <form className="loginForm" noValidate autoComplete="off" onSubmit={this.onSubmit}>
          <div>
            <TextField required id="userName" error={nameError} label="User Name" onChange={this.onNameChange} />
          </div>
          <div>
            <TextField
              id="password"
              required
              error={passwordError}
              label="Password"
              type="password"
              onChange={this.onPasswordChange}
            />
          </div>

          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>

          <Link to="/registration">New User</Link>
        </form>
        <ServiceErrorView />
      </div>
    );
  }
}
const mapDispatchToProps = {
  authenticate,
};
export default connect(() => {}, mapDispatchToProps)(LoginView);
