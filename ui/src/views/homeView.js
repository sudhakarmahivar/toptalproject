import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import UserListView from "./userListView";
import TimeSheetContainer from "./timeSheetContainer";
import { withStyles } from "@material-ui/core/styles";

import PreferencesView from "./preferencesView";
import HomeLeftPanel from "./homeLeftPanel";
import PageHeaderView from "./pageHeaderView";
import { getUserContext } from "../framework/userContext";
const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 20,
    width: "100%",
  },
  homeContent: {
    //marginLeft: 230,
    paddingLeft: 50,
    paddingRight: 50,
    flexGrow: 1,
  },
};
class HomeView extends React.Component {
  isManagerUsersAllowed = (role) => {
    return role === "m" || role === "a";
  };
  render() {
    const { role } = this.props.authContext;
    const { classes } = this.props;
    const manageUsers = this.isManagerUsersAllowed(role);
    const user = getUserContext();
    return (
      <div className={classes.root}>
        <HomeLeftPanel />
        <div className={classes.homeContent}>
          <Switch>
            {manageUsers && (
              <Route path={`/users`} key="users">
                <UserListView />
              </Route>
            )}
            <Route path={`/timesheets`} key="timesheets">
              <TimeSheetContainer />
            </Route>

            <Route path={`/preferences`} key="preferences">
              <PreferencesView />
            </Route>
            <Route path="/" key="home">
              <div>
                <PageHeaderView
                  title={`Welcome ${user.name || user.userName}`}
                  subtitle={
                    "Here you could manage your timesheets and preferences. If you are manager or admin, you can manage other users"
                  }
                />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({ authContext: state.authContext });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeView));
