import React from "react";
import { NavLink } from "react-router-dom";

//material-ui
import { withStyles } from "@material-ui/core/styles";
import { MenuList, MenuItem, Paper, ListItemIcon } from "@material-ui/core";
import { People as PeopleIcon, AccessTime as AccessTimeIcon, Settings as SettingsIcon } from "@material-ui/icons";

//app modules
import utils from "../framework/utils";
import { getUserContext } from "../framework/userContext";

const styles = {
  root: {
    width: 230,
    minHeight: "100%",
    backgroundColor: "#white",
    "& .MuiListItem-root": {
      marginBottom: 10,
    },
    "& .MuiListItemIcon-root": {
      minWidth: 35,
    },
  },
};
/**
 * Left Navigation Panel with links for timesheets, users
 * Based on permissions shows/hides menu items
 */
class HomeLeftPanel extends React.Component {
  render() {
    const { role } = getUserContext();
    const { classes } = this.props;
    const manageUsers = utils.isManagerOrAdmin(role);

    return (
      <div className="homeLeftPanel">
        <Paper className={classes.root}>
          <MenuList>
            {manageUsers && (
              <MenuItem>
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <NavLink to="/users">Manage Users</NavLink>
              </MenuItem>
            )}
            <MenuItem>
              <ListItemIcon>
                <AccessTimeIcon fontSize="small" />
              </ListItemIcon>
              <NavLink to="/timesheets">Manage Timesheets</NavLink>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <NavLink to="/preferences">Preferences</NavLink>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <NavLink to="/logout">Logout</NavLink>
            </MenuItem>
          </MenuList>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(HomeLeftPanel);
