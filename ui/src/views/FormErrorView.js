import React from "react";

export default class FormErrorView extends React.Component {
  render() {
    let { messages } = this.props;
    if (!messages) return null;
    //read only non null messages
    messages = messages.filter((m) => !!m);
    if (messages.length === 0) return null;
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
