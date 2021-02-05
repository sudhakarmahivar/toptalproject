import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
class HomeView extends React.Component {
  render() {
    const { role } = this.props.authContext;

    return (
      <div className="homeView">
        {role === "u" && <NavLink to="/users">Manage Users</NavLink>}
        <NavLink to="/timesheets">Manage Timesheets</NavLink>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({ authContext: state.authContext });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
