import { Paper } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";

export class ServiceErrorView extends React.Component {
  render() {
    const { errorCode, message } = this.props;
    if (!message) return null;
    return <div className="serviceErrorView">{message}</div>;
  }
}
const mapStateToProps = ({ error }, ownProps) => error;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceErrorView);
