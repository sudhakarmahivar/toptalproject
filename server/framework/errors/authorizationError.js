const errorCodes = require("./errorCodes");
const errorMessages = require("./errorMessages");
const ServiceError = require("./serviceError");

/**
 * Base class for all service error
 */
class AuthorizationError extends ServiceError {
  constructor(error = errorMessages.authorizationError) {
    super(errorCodes.authorizationError, error);
  }
}
module.exports = AuthorizationError;
