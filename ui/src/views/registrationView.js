import React from "react";
import { connect } from "react-redux";
import { Button, Link } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { registerUser } from "../controllers/loginController";
class RegistrationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      password: null,
      password2: null,
      error: null,
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
  onPassword2Change = ({ target }) => {
    this.setState({
      password2: target.value,
    });
  };

  onSubmit = () => {
    console.log("Register clicked");
    const { name, password, password2 } = this.state;
    if (password !== password2) {
      this.setState({
        error: "Retype password same in both",
      });
      return;
    }

    const { registerUser } = this.props;
    registerUser(name, password);
    console.log("all good. to submit data now");
  };
  render() {
    const { error } = this.state;
    return (
      <div className="registrationView">
        <form className="registrationForm" noValidate autoComplete="off">
          <div>
            <TextField required id="userName" label="User Name" onChange={this.onNameChange} />
          </div>
          <div>
            <TextField id="password" required label="Password" type="password" onChange={this.onPasswordChange} />
          </div>
          <div>
            <TextField
              id="password2"
              required
              label="Retype password"
              type="password"
              onChange={this.onPassword2Change}
            />
          </div>

          <Button variant="contained" color="primary" onClick={this.onSubmit}>
            Login
          </Button>
          <div>{error}</div>
          <Link href="#" onClick={() => {}} color="primary">
            New User
          </Link>
        </form>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = {
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
