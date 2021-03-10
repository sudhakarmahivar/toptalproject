import React from "react";
import { shallow } from "enzyme";
import sinon from "sinon";

import { LoginView } from "./LoginView";

describe("<LoginView />", () => {
  it("renders components", () => {
    const wrapper = shallow(<LoginView />);
    expect(wrapper.find(".loginView")).not.toBeNull();
  });
  it("renders userName and password fields", () => {
    const wrapper = shallow(<LoginView />);
    expect(wrapper.find("#userName").length).toBe(1);
    expect(wrapper.find("#password").length).toBe(1);
  });
  it("renders userName and password fields", () => {
    const wrapper = shallow(<LoginView />);
    expect(wrapper.find("#userName").length).toBe(1);
    expect(wrapper.find("#password").length).toBe(1);
  });
  it("onSubmit fails when password missing", () => {
    const wrapper = shallow(<LoginView />);
    wrapper.setState({ userName: "somone" });
    wrapper.instance().onSubmit({
      preventDefault: () => {},
    });
    expect(wrapper.state().passwordError).toBe(true);
    expect(wrapper.state().userNameError).toBe(false);
  });
  it("onSubmit fails when username missing", () => {
    const wrapper = shallow(<LoginView />);
    wrapper.setState({ userName: null, password: "somePassword" });
    wrapper.instance().onSubmit({
      preventDefault: () => {},
    });
    expect(wrapper.state().passwordError).toBe(false);
    expect(wrapper.state().userNameError).toBe(true);
  });
  it("onSubmit invokes authenticate when username, password provided", () => {
    let mockAuthenticate = jest.fn();
    const wrapper = shallow(<LoginView authenticate={mockAuthenticate} />);
    wrapper.setState({ userName: "someUser", password: "somePassword" });
    wrapper.instance().onSubmit({
      preventDefault: () => {},
    });
    expect(wrapper.state().passwordError).toBe(false);
    expect(wrapper.state().userNameError).toBe(false);
    expect(mockAuthenticate).toBeCalled();
    expect(mockAuthenticate.mock.calls[0][0]).toEqual("someUser");
    expect(mockAuthenticate.mock.calls[0][1]).toEqual("somePassword");
  });
});
