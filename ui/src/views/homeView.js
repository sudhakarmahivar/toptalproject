import React from "react";
import { Switch, Route } from "react-router-dom";
//material-ui
import { withStyles } from "@material-ui/core/styles";
//app modules
import TimeSheetContainer from "./timeSheetContainer";
import PreferencesView from "./preferencesView";
import HomeLeftPanel from "./homeLeftPanel";
import PageHeaderView from "./pageHeaderView";
import { getUserContext } from "../framework/userContext";
import UserListView from "./userListView";
import utils from "../framework/utils";
import LogoutView from "./logoutView";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 20,
    width: "100%",
  },
  homeContent: {
    paddingLeft: 50,
    paddingRight: 50,
    flexGrow: 1,
  },
};
/**
 * Container for authorized app view
 * Loads Timesheet List, User List, Preferences view
 */
export class HomeView extends React.Component {
  render() {
    const user = getUserContext();
    const role = user.role;
    const { classes } = this.props;
    const manageUsers = utils.isManagerOrAdmin(role);

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
            <Route path="/logout" key="logout">
              <LogoutView />
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
export default withStyles(styles)(HomeView);
