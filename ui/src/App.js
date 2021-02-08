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
import PreferencesView from "./views/preferencesView";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

class App extends React.Component {
  render() {
    const { authContext } = this.props;
    const loggedIn = !!authContext.accessToken;
    const routes = loggedIn
      ? [
          <Route path="/" key="home">
            <HomeView />
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
      <div className="app">
        <div className="appBanner">Toptal Time Sheet Evaluation Project</div>
        <div className="appContent">
          <ConnectedRouter history={history}>
            <Switch>
              {routes.map((route) => route)}
              <Route path="/">
                <Redirect to={{ pathname: "/" }} />
              </Route>
            </Switch>
          </ConnectedRouter>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  authContext: state.authContext,
}))(App);
