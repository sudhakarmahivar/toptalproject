import { authenticate, logout } from "./loginController";
import actionTypes from "../actionTypes";
import AuthApi from "../api/authApi";
import sinon from "sinon";
import apiError from "../api/apiError";
import errorHandler from "../framework/errorHandler";

describe("loginController tests", () => {
  let authStub, logoutStub;
  beforeEach(() => {
    authStub = sinon.stub(AuthApi.prototype, "authenticate").resolves({ userId: 1, userName: "one" });
    logoutStub = sinon.stub(AuthApi.prototype, "logout").resolves({ status: "ok" });
  });

  afterEach(() => {
    authStub.restore();
    logoutStub.restore();
  });

  it("should on authentication success issue authSucceeded action to redux", async () => {
    let mockDispatch = jest.fn();
    await authenticate("test", "test")(mockDispatch);
    expect(mockDispatch).toBeCalled();
    const action = mockDispatch.mock.calls[0][0];
    expect(action.type).toEqual(actionTypes.auth.authSucceeded);
    expect(action.data.userId).toEqual(1);
  });
  it("should on any authentication errors, doesnt dispatch actions", async () => {
    authStub.restore();
    authStub = sinon.stub(AuthApi.prototype, "authenticate").throws(new apiError("some-message", "some-errorcode"));
    let mockDispatch = jest.fn();
    expect(mockDispatch).not.toBeCalled();
  });

  it("should on on logout, issue loggedout action to redux", async () => {
    let mockDispatch = jest.fn();
    await logout()(mockDispatch);
    expect(mockDispatch).toBeCalled();
    const loggedOutDispatch = mockDispatch.mock.calls.find((call) => call[0].type === actionTypes.auth.loggedOut);
    expect(loggedOutDispatch).toBeTruthy();
  });
});
