import React from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { authenticate } from "../controllers/loginController";
import { Link } from "react-router-dom";
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

  onSubmit = () => {
    console.log("login clicked");

    const { name, password } = this.state;
    let nameError = false,
      passwordError = false;
    if (!name) nameError = true;
    if (!password) passwordError = true;
    this.setState({ nameError, passwordError });
    if (nameError || passwordError) return;
    const { authenticate } = this.props;
    authenticate(name, password);
    console.log("all good. to submit data now");
  };
  render() {
    const { nameError, passwordError } = this.state;
    console.log(nameError, passwordError);
    return (
      <div className="loginView">
        <form className="loginForm" noValidate autoComplete="off">
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

          <Button variant="contained" color="primary" onClick={this.onSubmit}>
            Login
          </Button>

          <Link to="/registration">New User</Link>
        </form>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = {
  authenticate,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
