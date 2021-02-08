import "./App.css";
import React from "react";
import { connect } from "react-redux";
import LoginView from "./views/loginView";
import HomeView from "./views/homeView";
import RegistrationView from "./views/registrationView";
import { Switch, Route, Redirect } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store";
/**
 * Main React App.
 * Create Sketon structure of header + content.
 * Routes based on auth status to either home, login or registration page
 */

export class App extends React.Component {
  render() {
    const { authContext } = this.props;
    const loggedIn = !!authContext.accessToken;
    const routes = loggedIn
      ? [
          //logged in routes
          <Route path="/" key="home">
            <HomeView />
          </Route>,
        ]
      : [
          //anonymous routes
          <Route exact path="/" key="login">
            <LoginView />
          </Route>,
          <Route path="/registration" key="registration">
            <RegistrationView />
          </Route>,
        ];

    return (
      <div className="app">
        <div className="appBanner">Toptal Time Sheet Project</div>
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
