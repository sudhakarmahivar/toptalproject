import "./App.css";
import React from "react";
import { connect } from "react-redux";
import LoginView from "./views/loginView";
import HomeView from "./views/homeView";
import RegistrationView from "./views/registrationView";
import UserListView from "./views/userListView";
import { Switch, Route, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store";
import TimeSheetContainer from "./views/timeSheetContainer";

class App extends React.Component {
  render() {
    const { authContext } = this.props;
    const loggedIn = !!authContext.accessToken;
    const routes = loggedIn
      ? [
          <Route exact path="/" key="home">
            <HomeView />
          </Route>,
          <Route path="/users" key="users">
            <UserListView />
          </Route>,
          <Route path="/timesheets" key="timesheets">
            <TimeSheetContainer />
          </Route>,
        ]
      : [
          <Route exact path="/" key="login">
            <LoginView />
          </Route>,
          <Route path="/registration" key="registration">
            <RegistrationView />
          </Route>,
        ];

    return (
      <div className="App">
        <ConnectedRouter history={history}>
          <Switch>
            {routes.map((route) => route)}
            <Route path="/">
              <Redirect to={{ pathname: "/" }} />
            </Route>
          </Switch>
        </ConnectedRouter>
      </div>
    );
  }
}

export default connect((state) => ({
  authContext: state.authContext,
}))(App);
