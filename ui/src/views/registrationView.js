import React from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { saveUser, registerUser } from "../controllers/userController";
import { clearError } from "../controllers/errorController";
import ServiceErrorView from "./ServiceErrorView";
import FormErrorView from "./FormErrorView";
import validatePasswordSchema from "../framework/passwordValidator";
class RegistrationView extends React.Component {
  passwordSchema = null;

  constructor(props) {
    super(props);
    const editMode = !!props.user;
    this.state = {
      user: this.props.user || {}, //assign passed user or empty user in case of new
      formErrors: null, //for localized error detections
      editMode,
      password2: null,
    };
  }
  onUserNameChange = ({ target }) => {
    const { user } = this.state;
    user.userName = target.value;
    this.setState({
      user,
      userNameError: false,
    });
  };
  onPasswordChange = ({ target }) => {
    const { user } = this.state;
    user.password = target.value;
    this.setState({
      user,
      passwordError: false,
    });
  };
  onPassword2Change = ({ target }) => {
    this.setState({
      password2: target.value,
      passwordError: false,
    });
  };
  handleRoleChange = ({ target }) => {
    const { user } = this.state;
    user.role = target.value;
    this.setState({
      user,
    });
  };
  /**
   * Validates password strength, matches
   * @param {*} password
   * @param {*} password2
   */
  validatePassword = (password, password2) => {
    if (password !== password2) {
      return "Password mismatch";
    }
    return validatePasswordSchema(password);
  };
  validateUserName = (userName, errors) => {
    return userName.length < 8 || !userName.match(/^[0-9a-z]+$/i)
      ? "User name should be 8 characters in length and only alphanumeric"
      : null;
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { user, editMode, password2 } = this.state;
    const { clearError, registerUser, saveUser, onSuccess } = this.props;
    //clear service and client errors
    clearError();
    this.setState({
      formErrors: null,
    });
    let errors = [];
    let userNameError = false,
      passwordError = false;

    let validationError = this.validateUserName(user.userName, errors);
    if (validationError) {
      errors.push(validationError);
      userNameError = true;
    }
    if (!editMode) {
      validationError = this.validatePassword(user.password, password2);
      if (validationError) {
        errors.push(validationError);
        passwordError = true;
      }
    }
    if (errors.length > 0) {
      this.setState({
        formErrors: errors,
        passwordError,
        userNameError,
      });
      return;
    }
    if (editMode) saveUser(user, onSuccess);
    else registerUser(user, onSuccess);
  };

  render() {
    const { user, formErrors, password2, editMode, userNameError, passwordError } = this.state;
    let { allowRoleEdit } = this.props;
    return (
      <div className="registrationView">
        <form className="registrationForm" noValidate autoComplete="off" onSubmit={this.onSubmit}>
          <div>User name instructions, password instructions goes here</div>
          <div>
            <TextField
              required
              id="userName"
              label="User Name"
              error={userNameError}
              onChange={this.onUserNameChange}
              value={user.userName}
            />
          </div>

          {!editMode && (
            <div>
              <div>
                <TextField
                  id="password"
                  required
                  label="Password"
                  type="password"
                  onChange={this.onPasswordChange}
                  value={user.password}
                  error={passwordError}
                />
              </div>
              <div>
                <TextField
                  id="password2"
                  required
                  label="Retype password"
                  type="password"
                  onChange={this.onPassword2Change}
                  value={password2}
                  error={passwordError}
                />
              </div>
            </div>
          )}
          {allowRoleEdit && (
            <FormControl className="roleSelector">
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="role"
                value={user.role}
                onChange={this.handleRoleChange}
                defaultValue={"u"}
              >
                <MenuItem value={"u"}>User</MenuItem>
                <MenuItem value={"m"}>Manager</MenuItem>
                <MenuItem value={"a"}>Admin</MenuItem>
              </Select>
            </FormControl>
          )}

          <div>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
            <FormErrorView messages={formErrors} />
          </div>
        </form>
        <ServiceErrorView />
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = {
  registerUser,
  saveUser,
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
