import React from "react";
import { connect } from "react-redux";

export class ServiceErrorView extends React.Component {
  render() {
    const { errorCode, message } = this.props;
    if (!message) return null;
    return <div>{errorCode + ":" + message}</div>;
  }
}
const mapStateToProps = ({ error }, ownProps) => error;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceErrorView);
