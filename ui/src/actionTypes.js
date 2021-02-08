const actionTypes = {
  auth: { authSucceeded: "authSucceeded" },
  userList: {
    refreshed: "userListRefreshed",
    addUser: "addUserToUserList",
    updateUser: "updateUserInUserList",
    deleteUser: "deleteUserInUserList",
  },
  editUser: {
    begin: "editUserBegin",
    end: "editUserEnd",
  },
  serviceStatus: {
    setSuccess: "setServiceStatusSuccess",
    setError: "setServiceStatusError",
    clearError: "clearErrorMessages",
    clearSuccess: "ClearSuccessMessages",
    clearAll: "clearAllServiceMessages",
  },
  registration: {
    redirectOnSuccess: "redirectOnSuccessRegistration",
    clearRedirections: "clearRegistrationRedirections",
    registrationSucceeded: "registrationSucceeded",
  },
  timeSheetList: {
    refreshed: "timeSheetListRefreshed",
    showDayTimeSheet: "showDayTimeSheet",
    addTimeSheets: "addTimeSheets",
    updateTimeSheets: "updateTimeSheets",
    deleteTimeSheets: "deleteTimeSheets",
  },
};
export default actionTypes;
