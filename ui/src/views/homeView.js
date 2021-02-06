import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
class HomeView extends React.Component {
  isManagerUsersAllowed = (role) => {
    return role === "m" || role === "a";
  };
  render() {
    const { role } = this.props.authContext;
    const manageUsers = this.isManagerUsersAllowed(role);

    return (
      <div className="homeView">
        {manageUsers && <NavLink to="/users">Manage Users</NavLink>}
        <NavLink to="/timesheets">Manage Timesheets</NavLink>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({ authContext: state.authContext });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
