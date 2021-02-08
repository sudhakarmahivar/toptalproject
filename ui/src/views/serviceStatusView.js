import React from "react";
import { connect } from "react-redux";
/**
 * Renders service api call success or error message received
 */
export class ServiceStatusView extends React.Component {
  render() {
    const { errorCode, message, successOnly } = this.props;
    //erroCode - exists in case of errors. Success scenarios null
    //message - could be either success or error message
    //successOnly : Render only when success message is available. Ignore otherwise

    if (!message) return null;

    let displayClass = "";
    if (successOnly) {
      //success display
      if (errorCode) return null; //but error present
      displayClass = "serviceSuccess";
    } else {
      if (!errorCode) return null; //error display asked but success message exist
      displayClass = "serviceError";
    }

    return <div className={"serviceStatusView " + displayClass}>{message}</div>;
  }
}
const mapStateToProps = ({ serviceStatus }) => serviceStatus;
export default connect(mapStateToProps)(ServiceStatusView);
