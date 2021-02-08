import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { logout } from "../controllers/loginController";
/**
 * On logout user briefly lands in this page
 * On landing, user signed out in server and takes user to home
 */
export class LogoutView extends React.Component {
  componentDidMount() {
    //give a sec to display message and logout
    setTimeout(() => this.props.logout(), 1000);
  }
  render() {
    const loggedOut = !this.props.userId;
    return (
      <div>
        {loggedOut ? (
          <Redirect to={{ pathname: "/" }} />
        ) : (
          <div className={"logoutView"}>
            You are being logged out. Once completed, you'll be redirected to home page
          </div>
        )}
      </div>
    );
  }
}
const mapDispatchToProps = { logout };

export default connect((state) => ({ userId: state.authContext.userId }), mapDispatchToProps)(LogoutView);
