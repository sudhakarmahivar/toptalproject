const actionTypes = {
  auth: { authSucceeded: "authSucceeded" },
  userList: {
    refreshed: "userListRefreshed",
    addUser: "addUserToUserList",
    updateUser: "updateUserInUserList",
  },
  editUser: {
    begin: "editUserBegin",
    end: "editUserEnd",
  },
  error: {
    setError: "setError",
    clearError: "clearError",
  },
  registration: {
    redirectOnSuccess: "redirectOnSuccessRegistration",
    clearRedirections: "clearRegistrationRedirections",
    registrationSucceeded: "registrationSucceeded",
  },
};
export default actionTypes;
