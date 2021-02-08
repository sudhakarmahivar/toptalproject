import React from "react";
/**
 * Displays instructions, messages , information
 * Uses in top of pages/forms to instruct users
 */
class MessageDisplayView extends React.Component {
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
