import React from "react";
/**
 * Displays form errors ( client side validations)
 * Expects array of messages to be displayed
 */
export default class FormErrorView extends React.Component {
  render() {
    let { messages } = this.props;
    if (!messages) return null;

    //Clear any null messages,
    messages = messages.filter((m) => !!m);
    if (messages.length === 0) return null;

    //display message array
    return (
      <div className="formErrorView">
        {messages.map((message, i) => (
          <div className="formError" key={i}>
            {message}
          </div>
        ))}
      </div>
    );
  }
}
