const errorMessages = {
  validDateRequired: "Date mandatory and should be in past",
  validHoursRequired: "Hours mandatory and should be < 24 hours",
  TotalDayHoursExceedLimit: "Total hours for day, should be <=24 hours",
  validActivityRequired: "Activity Required",
  authenticationError: "Unable to authenticate user",
  unauthorizedForTimeSheet: "Not authroized for the timesheet", //authorization error specific to timesheet
  authorizationError: "You are not authorized", //generic error
  userNameError: "LoginId should be 8 characters in length and only alphanumeric",
  passwordRulesError: "Password should be 8-25 chars length and should contain Upper case letter, number and digit",
  nameError: "Name should be < 25 chars length and contain only alphabets",
  emailError: "Invalid Email provided",
  workingHoursPerDayError: "Working Hours per day should be between 0 and 24",
  authorizationHeaderMissing: "Authorization header missing",
  accessTokenInvalid: "Access token invalid",
  accessTokenInactivated: "Access token inactivated",
  userNameAlreadyExists: "LoginId already exists",
  userDoesntExist: "User doesnt exist",
  notAuthorizedForUserRecord: "Not authorized for User record",
  invalidCredentials: "Invalid credentials",
};
module.exports = errorMessages;
