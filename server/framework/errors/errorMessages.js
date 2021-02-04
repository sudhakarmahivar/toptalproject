/**
 * Base class for all service error
 */
const errorMessages = {
  validDateRequired: "Date mandatory and should be in past",
  validHoursRequired: "Hours mandatory and should be < 24 hours",
  TotalDayHoursExceedLimit: "Total hours for day, should be <=24 hours",
  validActivityRequired: "Activity Required",
  authenticationError: "Unable to authenticate user",
  unauthorizedForTimeSheet: "Not authroized for the timesheet", //authorization error specific to timesheet
  authorizationError: "You are not authorized", //generic error
  userNameError: "User name should be 8 characters in length and only alphanumeric",
  passwordRulesError: "Password should be 8-25 chars length and should contain Upper case letter, number and digit",
};
module.exports = errorMessages;
