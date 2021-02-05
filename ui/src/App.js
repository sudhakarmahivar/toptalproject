import "./App.css";
import React from "react";
import { connect } from "react-redux";
import LoginView from "./views/loginView";
import RegistrationView from "./views/registrationView";
import UserListView from "./views/userListView";

class App extends React.Component {
  render() {
    const { authContext } = this.props;
    return (
      <div className="App">
        <LoginView />
        <RegistrationView />
        {authContext.accessToken ? <UserListView /> : null}
      </div>
    );
  }
}

export default connect((state) => ({
  authContext: state.authContext,
}))(App);
