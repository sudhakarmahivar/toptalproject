import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import PeopleIcon from "@material-ui/icons/People";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SettingsIcon from "@material-ui/icons/Settings";
const styles = {
  root: {
    width: 230,
    minHeight: "100%",
    backgroundColor: "#white",
    //position: "fixed",
    "& .MuiListItem-root": {
      marginBottom: 10,
      //marginLeft: 5,
    },
    "& .MuiListItemIcon-root": {
      minWidth: 35,
      //marginLeft: 5,
    },
  },
};
class HomeLeftPanel extends React.Component {
  isManagerUsersAllowed = (role) => {
    return role === "m" || role === "a";
  };
  render() {
    const { role } = this.props.authContext;
    const { classes } = this.props;
    const manageUsers = this.isManagerUsersAllowed(role);

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
          </MenuList>
        </Paper>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({ authContext: state.authContext });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeLeftPanel));
