import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
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
import MessageDisplayView from "./MessageDisplayView";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
const styles = (theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
  },
});

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
  onNameChange = ({ target }) => {
    const { user } = this.state;
    user.name = target.value;
    this.setState({
      user,
      nameError: false,
    });
  };
  onEmailChange = ({ target }) => {
    const { user } = this.state;
    user.email = target.value;
    this.setState({
      user,
      emailError: false,
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
  validatePassword = (password = "", password2 = "") => {
    if (password !== password2) {
      return "Password mismatch";
    }
    return validatePasswordSchema(password);
  };
  validateUserName = (userName = "") => {
    return userName.length < 8 || !userName.match(/^[0-9a-z]+$/i)
      ? "User name should be 8 characters in length and only alphanumeric"
      : null;
  };
  validateName = (name = "") => {
    return !name || name.length === 0 || !name.match(/^[0-9a-z\s]+$/i)
      ? "Name is required and should have only alphabets and spaces"
      : null;
  };
  validateEmail = (email = "") => {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  };
  goBack = () => {
    this.props.history.goBack();
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
      passwordError = false,
      emailError = false,
      nameError = false;
    if (this.validateName(user.name)) {
      errors.push("Enter name with no special characters");
      nameError = true;
    }
    console.log(errors);
    if (this.validateEmail(user.email)) {
      errors.push("Provide valid email");
      emailError = true;
    }
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
        nameError,
        emailError,
      });
      return;
    }
    if (editMode) saveUser(user, onSuccess);
    else registerUser(user, onSuccess);
  };

  render() {
    const { user, formErrors, password2, editMode, userNameError, emailError, nameError, passwordError } = this.state;
    let { allowRoleEdit, classes } = this.props;
    let messages = [
      "User name should be 8 characters in length and only alphanumeric",
      "Password should be 8-25 chars length and should contain Upper case letter, number and digit",
    ];
    return (
      <div className="registrationView">
        <Paper className="paperWrapper">
          <div className={classes.root}>
            <form className="registrationForm" noValidate autoComplete="off" onSubmit={this.onSubmit}>
              <MessageDisplayView messages={messages} />
              <div>
                <TextField
                  required
                  id="name"
                  label="Name"
                  error={nameError}
                  onChange={this.onNameChange}
                  value={user.name}
                  fullWidth={true}
                />
                <TextField
                  required
                  id="email"
                  label="Email"
                  error={emailError}
                  onChange={this.onEmailChange}
                  value={user.email}
                  fullWidth={true}
                />
                <TextField
                  required
                  id="userName"
                  label="User Name"
                  error={userNameError}
                  onChange={this.onUserNameChange}
                  value={user.userName}
                  fullWidth={true}
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
                      fullWidth={true}
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
                      fullWidth={true}
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
                    fullWidth={true}
                  >
                    <MenuItem value={"u"}>User</MenuItem>
                    <MenuItem value={"m"}>Manager</MenuItem>
                    <MenuItem value={"a"}>Admin</MenuItem>
                  </Select>
                </FormControl>
              )}
              <ServiceErrorView />
              <FormErrorView messages={formErrors} />

              <div className="actionPanel">
                <Button variant="outlined" color="secondary" onClick={this.goBack}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(RegistrationView)));
