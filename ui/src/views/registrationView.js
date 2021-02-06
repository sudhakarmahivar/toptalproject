import React from "react";
import { connect } from "react-redux";
import { Button, Link } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { registerUser } from "../controllers/loginController";
class RegistrationView extends React.Component {
  edit = false;
  constructor(props) {
    super(props);
  }
  onUserNameChange = ({ target }) => {};
  onPasswordChange = ({ target }) => {};
  onPassword2Change = ({ target }) => {};
  handleRoleChange = (event) => {};

  onSubmit = () => {
    console.log("Register clicked");
  };
  render() {
    const { user } = this.props;
    return (
      <div className="registrationView">
        <form className="registrationForm" noValidate autoComplete="off">
          <div>
            <TextField required id="userName" label="User Name" onChange={this.onUserNameChange} />
          </div>
          {!this.edit ? (
            <div>
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
            </div>
          ) : (
            <FormControl className="roleSelector">
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select labelId="demo-simple-select-label" id="role" value={user.age} onChange={this.handleRoleChange}>
                <MenuItem value={"u"}>User</MenuItem>
                <MenuItem value={"m"}>Manager</MenuItem>
                <MenuItem value={"a"}>Administrator</MenuItem>
              </Select>
            </FormControl>
          )}
          <div>
            <Button variant="contained" color="primary" onClick={this.onSubmit}>
              Submit
            </Button>
          </div>
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
