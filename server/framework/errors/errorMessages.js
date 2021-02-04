/**
 * Base class for all service error
 */
const errorMessages = {
  validDateRequired: "Date mandatory and should be in past",
  validHoursRequired: "Hours mandatory and should be < 24 hours",
  TotalDayHoursExceedLimit: "Total hours for day, should be <=24 hours",
  validActivityRequired: "Activity Required",
  authenticationError: "Unable to authenticate user",
};
module.exports = errorMessages;
