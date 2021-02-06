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

class App extends React.Component {
  render() {
    const { authContext } = this.props;
    console.log(this.props);
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
