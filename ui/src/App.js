import "./App.css";
import React from "react";
import { connect } from "react-redux";
import LoginView from "./views/loginView";
import HomeView from "./views/homeView";
import RegistrationView from "./views/registrationView";
import UserListView from "./views/userListView";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
class App extends React.Component {
  render() {
    const { authContext } = this.props;
    const loggedIn = !!authContext.accessToken;
    console.log("LoggedIn:", loggedIn);
    const routes = loggedIn
      ? [
          <Route exact path="/">
            <HomeView />
          </Route>,
          <Route path="/users">
            <UserListView />
          </Route>,
        ]
      : [
          <Route exact path="/">
            <LoginView />
          </Route>,
          <Route path="/registration">
            <RegistrationView />
          </Route>,
        ];

    return (
      <div className="App">
        <Router>
          <Switch>
            {routes.map((route) => route)}
            <Route path="/">
              <Redirect to={{ pathname: "/" }} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect((state) => ({
  authContext: state.authContext,
}))(App);
