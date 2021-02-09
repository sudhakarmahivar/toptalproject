import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

//material-ui
import { Select, FormControl, MenuItem, InputLabel, TextField, Button, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";

//app modules
import { saveUser, registerUser } from "../controllers/userController";
import { clearError } from "../controllers/serviceStatusController";
import ServiceStatusView from "./serviceStatusView";
import FormErrorView from "./FormErrorView";
import validatePasswordSchema from "../framework/passwordValidator";
import MessageDisplayView from "./MessageDisplayView";
import messages from "../messages";

const styles = (theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
  },
});
/**
 * Register new user
 * Self registration : New user registration happens
 * Registration  by manager, admin is supported
 */
class RegistrationView extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    registerUser: PropTypes.func,
    saveUser: PropTypes.func,
    clearError: PropTypes.func,
    classes: PropTypes.object,
  };
  static defaultProps = {
    user: null,
    registerUser: () => {},
    saveUser: () => {},
    clearError: () => {},
    classes: {},
  };
  constructor(props) {
    super(props);
    const editMode = !!props.user;
    this.state = {
      user: this.props.user || {}, //assign passed user or empty user in case of new
      formErrors: null, //for localized error detections
      editMode,
      password2: null,
    };
    props.clearError();
  }
  //on any field change, assigns to state, and resets its corresponding error field
  onFieldChange = ({ target }, field, errorField) => {
    const { user } = this.state;
    user[field] = target.value;
    const newState = { user };
    if (errorField) newState[errorField] = false;
    this.setState(newState);
  };

  onPassword2Change = ({ target }) => {
    this.setState({
      password2: target.value,
      passwordError: false,
    });
  };

  /**
   * Validates password strength, matches
   * @param {*} password
   * @param {*} password2
   */
  validatePassword = (password = "", password2 = "") => {
    if (password !== password2) {
      return messages.passwordMismatch;
    }
    return validatePasswordSchema(password);
  };
  validateUserName = (userName = "") => {
    return userName.length < 8 || userName.length > 25 || !userName.match(/^[0-9a-z]+$/i)
      ? messages.userNameError
      : null;
  };
  validateName = (name = "") => {
    return !name || name.length === 0 || name.length > 50 || !name.match(/^[0-9a-z\s]+$/i) ? messages.nameError : null;
  };
  validateEmail = (email = "") => {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  };
  goBack = () => {
    (this.props.onCancel || this.props.history.goBack)();
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
    let error = this.validateName(user.name);
    if (error) {
      errors.push(error);
      nameError = true;
    }
    if (this.validateEmail(user.email)) {
      errors.push(messages.emailError);
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
    if (!user.role) user.role = "u";
    if (editMode) saveUser(user, onSuccess);
    else registerUser(user, onSuccess);
  };

  render() {
    const { user, formErrors, password2, editMode, userNameError, emailError, nameError, passwordError } = this.state;
    let { allowRoleEdit, classes } = this.props;
    let instructions = [messages.userNameInstruction, messages.passwordInstruction];
    return (
      <div className="registrationView">
        <Paper className="paperWrapper">
          <div className={classes.root}>
            <form className="registrationForm" noValidate autoComplete="off" onSubmit={this.onSubmit}>
              <MessageDisplayView messages={instructions} />
              <div>
                <TextField
                  required
                  id="name"
                  label="Name"
                  error={nameError}
                  onChange={(e) => this.onFieldChange(e, "name", "nameError")}
                  value={user.name}
                  fullWidth={true}
                />
                <TextField
                  required
                  id="email"
                  label="Email"
                  error={emailError}
                  onChange={(e) => this.onFieldChange(e, "email", "emailError")}
                  value={user.email}
                  fullWidth={true}
                />
                <TextField
                  required
                  id="userName"
                  label="Login Id"
                  error={userNameError}
                  onChange={(e) => this.onFieldChange(e, "userName", "userNameError")}
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
                      onChange={(e) => this.onFieldChange(e, "password", "passwordError")}
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
                    onChange={(e) => this.onFieldChange(e, "role", "roleError")}
                    defaultValue={"u"}
                    fullWidth={true}
                  >
                    <MenuItem value={"u"}>User</MenuItem>
                    <MenuItem value={"m"}>Manager</MenuItem>
                    <MenuItem value={"a"}>Admin</MenuItem>
                  </Select>
                </FormControl>
              )}
              <ServiceStatusView />
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
const mapDispatchToProps = {
  registerUser,
  saveUser,
  clearError,
};

export default connect(null, mapDispatchToProps)(withRouter(withStyles(styles)(RegistrationView)));
