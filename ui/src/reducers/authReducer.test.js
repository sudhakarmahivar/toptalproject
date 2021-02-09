import authReducer from "./authReducer";
import actionTypes from "../actionTypes";
/*
  if (action.type === actionTypes.userList.updateUser) {
    const user = action.data;
    if (user.userId === state.userId) {
      //current logged in user.Update details such as workingHoursPerDay, role etc
      return {
        ...state,
        ...action.data,
      };
    }
  }
  return state;
  */
describe("AuthReducer tests", () => {
  it("sets accessToken,userId in state when auth succeeds", () => {
    const testUser = { userId: "test", accessToken: "at" };
    const newState = authReducer(
      {},
      {
        type: actionTypes.auth.authSucceeded,
        data: testUser,
      }
    );
    expect(newState.accessToken).toEqual(testUser.accessToken);
    expect(newState.userId).toEqual(testUser.userId);
  });
  it("clears accessToken,userId in state on logout", () => {
    const loginState = { userId: "test", accessToken: "at" };
    const newState = authReducer(loginState, {
      type: actionTypes.auth.loggedOut,
    });
    expect(newState.accessToken).toEqual(null);
    expect(newState.userId).toEqual(null);
  });
  it("updates user context, when current user is updated, but retaining access token", () => {
    const loginState = { userId: "test", accessToken: "at", name: "old name" };
    const newState = authReducer(loginState, {
      type: actionTypes.userList.updateUser,
      data: { userId: "test", name: "newName" },
    });
    expect(newState.accessToken).toEqual("at");
    expect(newState.name).toEqual("newName");
  });
  it("doesnt update user context, when other users are updated", () => {
    const loginState = { userId: "test", accessToken: "at", name: "old name" };
    const newState = authReducer(loginState, {
      type: actionTypes.userList.updateUser,
      data: { userId: "test-another", name: "newName" },
    });
    expect(newState.accessToken).toEqual("at");
    expect(newState.name).toEqual("old name");
  });
});
