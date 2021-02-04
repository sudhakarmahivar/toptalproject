const errorCodes = require("./errorCodes");
const errorMessages = require("./errorMessages");
const ServiceError = require("./serviceError");

/**
 * Base class for all service error
 */
class AuthenticationError extends ServiceError {
  constructor(error = errorMessages.authenticationError) {
    super(errorCodes.authenticationError, error);
  }
}
module.exports = AuthenticationError;
