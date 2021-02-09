import React from "react";
import PropTypes from "prop-types";

/**
 * Displays instructions, messages , information
 * Uses in top of pages/forms to instruct users
 */
class MessageDisplayView extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string),
  };
  static defaultProps = {
    messages: [],
  };
  render() {
    const { messages } = this.props;
    if (!messages || messages.length === 0) return null;
    return (
      <div className="messageDisplayView">
        {messages.map((msg) => (
          <div className="message">{msg}</div>
        ))}
      </div>
    );
  }
}

export default MessageDisplayView;
